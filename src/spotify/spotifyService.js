import store from "@/store/store";
import {SpotifyRepository} from "@/spotify/spotifyRepository";
import {SpotifyMultiRequestHandler} from "@/spotify/spotifyMultiRequestHandler";
import {Playlist} from "@/models/Playlist";
import {Song} from "@/models/Song";
import {getSongsFromDependencyList} from "@/utilities/Dependency";
import moment from "moment";

export const CATEGORY_REGEX = /\[.*?\]/g;

export class SpotifyService {

    static async fetchEverything() {
        let playlists = await SpotifyRepository.fetchCurrentUserPlaylists();
        store.commit("playlists", playlists);
        playlists = playlists.map((playlist) => new Playlist(playlist))
        store.commit("playlists", playlists);
        playlists = await this.fetchPlaylistSongs(playlists)
        store.commit("playlists", playlists);
        store.commit("refreshedOn", moment())
        console.log("DPLS:", store.getters.getDynamicPlaylists)
        console.log("TPLS:", store.getters.getTaggedPlaylists)
        console.log("UTPLS:", store.getters.getUntaggedPlaylists)
        return playlists
    }

    static async fetchPlaylistSongs(playlists) {
        return await Promise.all(playlists.map(async (pl) => {
            let songs = await SpotifyRepository.fetchPlaylistTracks(pl.id)
            pl.songs = songs
                .filter((song) => song.track !== null)
                .map((song) => new Song(song))
            return pl
        }))
    }

    static async refreshDynamicPlaylistSongs(playlists) {
        for (let pl of playlists) {
            const oldSongs = pl.songs

            if (oldSongs.length) {
                const oldSongUris = oldSongs.map((song) => {
                    return {uri: song.uri}
                })
                await SpotifyMultiRequestHandler.deleteAllPlaylistTracks(pl.id, oldSongUris)
            }

            const newSongUris = getSongsFromDependencyList(pl.dependency).map((song) => song.uri)
            await SpotifyMultiRequestHandler.addAllPlaylistTracks(pl.id, newSongUris)
        }
    }

    static async createPlaylist(name, description) {
        return await SpotifyRepository.createPlaylist(store.state.user.id, name, description);
    }

    static async editPlaylist(playlistId, name, description) {
        return await SpotifyRepository.editPlaylist(playlistId, name, description);
    }

    static async deletePlaylist(playlistId) {
        return await SpotifyRepository.deletePlaylist(playlistId);
    }
}