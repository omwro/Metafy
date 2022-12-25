import store from "/src/store";
import {SpotifyRepository} from "/src/spotify/spotifyRepository";
import {Playlist} from "/src/models/Playlist";
import {Song} from "/src/models/Song";
import {getSongsFromDependencyList} from "/src/utilities/Dependency";
import moment from "moment";

export class SpotifyService {

    static async fetchEverything() {
        const playlists = await SpotifyRepository.fetchCurrentUserPlaylists();
        const reducedPlaylists = playlists
            .reduce((object, playlist) => {
                object[playlist.id] = new Playlist(playlist);
                return object;
            }, {})

        const {updatedPlaylists, songs} = await this.fetchPlaylistSongs(reducedPlaylists)
        console.log("playlists", updatedPlaylists)
        console.log("songs", songs)
        store.commit("playlists", updatedPlaylists);
        store.commit("songs", songs);
        store.commit("refreshedOn", moment())

        console.log("DPLS:", store.getters.getDynamicPlaylists())
        console.log("TPLS:", store.getters.getTaggedPlaylists())
        console.log("UTPLS:", store.getters.getUntaggedPlaylists())

        return playlists
    }

    static async fetchPlaylistSongs(oldPlaylists) {
        let playlists = {}
        let songs = {};
        let oldPlaylistValues = Object.values(oldPlaylists)

        const likedTracks = await SpotifyRepository.fetchCurrentUserLikedTracks();
        oldPlaylistValues.push(new Playlist({
            id: "liked", uri: null, external_urls: null, name: "Liked Songs", description: null, tracks: {
                total: likedTracks.length
            }, images: [{url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}]
        }))
        for (const playlist of oldPlaylistValues) {
            let playlistSongs = playlist.id !== "liked" ?
                await SpotifyRepository.fetchPlaylistTracks(playlist.id) :
                likedTracks;
            playlistSongs = playlistSongs
                .filter(song => song.track !== null)
                .map(song => new Song(song))

            playlistSongs.forEach(song => {
                // Add song if it does not exist yet
                if (songs[song.id] === undefined) {
                    songs[song.id] = song
                }

                if (!songs[song.id].playlists.includes(playlist.id)) {
                    songs[song.id].playlists.push(playlist.id)
                }
            })
            playlist.songs = playlistSongs.map(song => song.id)
            playlists[playlist.id] = playlist
        }

        return {updatedPlaylists: playlists, songs}
    }

    static async refreshDynamicPlaylistSongs(playlists) {
        const PLAYLIST_TRACK_FETCH_LIMIT = 100;
        for (let pl of playlists) {
            const oldSongs = pl.songs.map(songId => store.state.songs[songId])

            if (oldSongs.length) {
                const oldSongUris = oldSongs.map((song) => {
                    return {uri: song.uri}
                })
                const slicedTrackUriArray = this.sliceArrayIntoChunks(oldSongUris, PLAYLIST_TRACK_FETCH_LIMIT);
                for (const t of slicedTrackUriArray) {
                    await SpotifyRepository.deletePlaylistTracks(pl.id, t);
                }
            }

            let newSongUris = getSongsFromDependencyList(pl.dependency)
            newSongUris = newSongUris.sort((a, b) => b.release_date < a.release_date)
            newSongUris = newSongUris.map((song) => song.uri)
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