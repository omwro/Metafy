import axios from 'axios';

export class PlaylistRepository {

    static async fetchUserPlaylists() {
        return axios.get("https://api.spotify.com/v1/me/playlists?limit=50")
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async fetchPlaylistTracks(playlistId) {
        return axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }
}