import {SpotifyRepository} from "@/spotify/spotifyRepository";

const PLAYLIST_FETCH_LIMIT = 50;
const PLAYLIST_TRACK_FETCH_LIMIT = 100;

export class SpotifyMultiRequestHandler {

    static async fetchAllCurrentUserPlaylists() {
        let playlists = [];
        let total = 1;
        // Loop through the request, because of restriction with request all items.
        for (let offset = 0; offset < total;) {
            const fetch = await SpotifyRepository.fetchCurrentUserPlaylists(offset);
            offset += PLAYLIST_FETCH_LIMIT;
            if (offset < fetch.total) total += PLAYLIST_FETCH_LIMIT
            // Add the new fetched items to the playlist instead of adding the array itself.
            playlists = playlists.concat(fetch.items);
        }
        return playlists
    }

    static async fetchAllPlaylists(playlistIds) {
        let playlists = [];
        // Loop through the request, because of restriction with request all items.
        for (let i = 0; i < playlistIds.length;) {
            const fetch = await SpotifyRepository.fetchPlaylist(playlistIds[++i]);
            playlists.push(fetch);
        }
        return playlists
    }

    static async fetchAllPlaylistTracks(playlistId) {
        let playlists = [];
        let total = 1;
        // Loop through the request, because of restriction with request all items.
        for (let offset = 0; offset < total;) {
            const fetch = await SpotifyRepository.fetchPlaylistTracks(playlistId, offset);
            offset += PLAYLIST_TRACK_FETCH_LIMIT;
            if (offset < fetch.total) total += PLAYLIST_TRACK_FETCH_LIMIT
            // Add the new fetched items to the playlist instead of adding the array itself.
            playlists = playlists.concat(fetch.items);
        }
        return playlists
    }

    // Split array into chunks
    static sliceArrayIntoChunks(array, chunkSize) {
        const newArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            newArray.push(chunk)
        }
        return newArray;
    }

    static async addAllPlaylistTracks(playlistId, trackUris) {
        const slicedTrackUriArray = this.sliceArrayIntoChunks(trackUris, PLAYLIST_TRACK_FETCH_LIMIT);
        console.log("sliced", slicedTrackUriArray)
        for (const t of slicedTrackUriArray) {
            await SpotifyRepository.addPlaylistTracks(playlistId, t);
        }
        return true;
    }

    static async deleteAllPlaylistTracks(playlistId, trackUris) {
        const slicedTrackUriArray = this.sliceArrayIntoChunks(trackUris, PLAYLIST_TRACK_FETCH_LIMIT);
        for (const t of slicedTrackUriArray) {
            await SpotifyRepository.deletePlaylistTracks(playlistId, t);
        }
        return true;
    }
}