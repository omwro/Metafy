import axios from 'axios';

const PLAYLISTS_API_URI = "https://api.spotify.com/v1/playlists";
const PLAYLIST_FETCH_LIMIT = 50;
const PLAYLIST_TRACK_FETCH_LIMIT = 100;

export class SpotifyRepository {

    static async fetchCurrentUserPlaylists(offset = 0, limit = PLAYLIST_FETCH_LIMIT) {
        return axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async fetchPlaylist(playlistId) {
        return axios.get(`${PLAYLISTS_API_URI}/${playlistId}`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async fetchPlaylistTracks(playlistId, offset = 0, limit = PLAYLIST_TRACK_FETCH_LIMIT) {
        return axios.get(`${PLAYLISTS_API_URI}/${playlistId}/tracks?limit=${limit}&offset=${offset}`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async addPlaylistTracks(playlistId, trackUris) {
        return axios.post(`${PLAYLISTS_API_URI}/${playlistId}/tracks`, {
            uris: trackUris
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async deletePlaylistTracks(playlistId, trackUris) {
        return axios.delete(`${PLAYLISTS_API_URI}/${playlistId}/tracks`,{
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                tracks: trackUris
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }

    static async createPlaylist(userId, name, description) {
        return axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name,
            description
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository", e))
    }
}