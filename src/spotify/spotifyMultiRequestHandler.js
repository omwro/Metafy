import {SpotifyRepository} from "@/spotify/spotifyRepository";

// const PLAYLIST_FETCH_LIMIT = 50;
const PLAYLIST_TRACK_FETCH_LIMIT = 100;

export class SpotifyMultiRequestHandler {

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