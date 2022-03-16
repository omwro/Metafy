import store from "@/store/store";
import {SpotifyRepository} from "@/spotify/spotifyRepository";
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
        let likedTracks = await SpotifyRepository.fetchCurrentUserLikedTracks()
        const taggedSongs = store.getters.getTaggedSongs(store.getters)
        store.commit("taggedTracks", taggedSongs)
        likedTracks = likedTracks.map((song) => new Song(song))
        store.commit("likedTracks", likedTracks);
        console.log("LIKED:",likedTracks)
        const tags = store.getters.getTagsFromTaggedPlaylists(store.getters)
        store.commit("tags", tags);
        console.log("TAGS:",tags)
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
        const PLAYLIST_TRACK_FETCH_LIMIT = 100;
        for (let pl of playlists) {
            const oldSongs = pl.songs

            if (oldSongs.length) {
                const oldSongUris = oldSongs.map((song) => {
                    return {uri: song.uri}
                })
                const slicedTrackUriArray = this.sliceArrayIntoChunks(oldSongUris, PLAYLIST_TRACK_FETCH_LIMIT);
                for (const t of slicedTrackUriArray) {
                    await SpotifyRepository.deletePlaylistTracks(pl.id, t);
                }
            }

            const newSongUris = getSongsFromDependencyList(pl.dependency).map((song) => song.uri)
            const slicedTrackUriArray = this.sliceArrayIntoChunks(newSongUris, PLAYLIST_TRACK_FETCH_LIMIT);
            for (const t of slicedTrackUriArray) {
                await SpotifyRepository.addPlaylistTracks(pl.id, t);
            }
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

    static sliceArrayIntoChunks(array, chunkSize) {
        const newArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            newArray.push(chunk)
        }
        return newArray;
    }

    static async addSongToPlaylist(song, tag) {
        await SpotifyRepository.addPlaylistTracks(tag.playlistid, [song.uri]);
        await store.commit("addSongTag", [song, tag])

    }
}