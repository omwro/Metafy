import axios from 'axios';

export class PlaylistRepository {

    static async fetchCurrentUserPlaylists(limit, offset) {
        return axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async fetchPlaylistTracks(playlistId) {
        return axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }
}