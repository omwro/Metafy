import axios from 'axios';

const PLAYLISTS_API_BASE_URI = "https://api.spotify.com/v1";
const PLAYLISTS_API_PLAYLISTS_URI = `${PLAYLISTS_API_BASE_URI}/playlists`;
const DEFAULT_OFFSET = 0;
const PLAYLIST_FETCH_LIMIT = 50;
const PLAYLIST_TRACK_FETCH_LIMIT = 100;

export class SpotifyRepository {

    static async fetchCurrentUserPlaylists(
        items = [],
        uri = `${PLAYLISTS_API_BASE_URI}/me/playlists?limit=${PLAYLIST_FETCH_LIMIT}&offset=${DEFAULT_OFFSET}`
    ) {
        return axios.get(uri)
            .then(async response => {
                const { data } = response
                items.push(...data.items);
                if (data.next !== null) {
                    return await this.fetchCurrentUserPlaylists(items, data.next)
                }
                return items
            })
            .catch(e => console.error("PlaylistRepository.fetchCurrentUserPlaylists()", e))
    }

    static async fetchCurrentUserLikedTracks(
        items = [],
        uri = `${PLAYLISTS_API_BASE_URI}/me/tracks?limit=${PLAYLIST_FETCH_LIMIT}&offset=${DEFAULT_OFFSET}`
    ) {
        return axios.get(uri)
            .then(async response => {
                const { data } = response
                items.push(...data.items);
                if (data.next !== null) {
                    return await this.fetchCurrentUserLikedTracks(items, data.next)
                }
                return items
            })
            .catch(e => console.error("PlaylistRepository.fetchCurrentUserLikedTracks()", e))
    }

    static async fetchPlaylist(
        playlistId
    ) {
        return axios.get(`${PLAYLISTS_API_PLAYLISTS_URI}/${playlistId}`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.fetchPlaylist()", e))
    }

    static async fetchPlaylistTracks(
        playlistId,
        items = [],
        uri = `${PLAYLISTS_API_PLAYLISTS_URI}/${playlistId}/tracks?limit=${PLAYLIST_TRACK_FETCH_LIMIT}&offset=${DEFAULT_OFFSET}`
    ) {
        return axios.get(uri)
            .then(async response => {
                const {data} = response
                items.push(...data.items);
                if (data.next !== null) {
                    return await this.fetchPlaylistTracks(playlistId, items, data.next)
                }
                return items
            })
            .catch(e => console.error("PlaylistRepository.fetchPlaylistTracks()", e))
    }

    static async addPlaylistTracks(
        playlistId,
        trackUris
    ) {
        return axios.post(`${PLAYLISTS_API_PLAYLISTS_URI}/${playlistId}/tracks`, {
            uris: trackUris
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.addPlaylistTracks()", e))
    }

    static async deletePlaylistTracks(
        playlistId,
        trackUris
    ) {
        return axios.delete(`${PLAYLISTS_API_PLAYLISTS_URI}/${playlistId}/tracks`,{
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                tracks: trackUris
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.deletePlaylistTracks()", e))
    }

    static async createPlaylist(
        userId,
        name,
        description
    ) {
        return axios.post(`${PLAYLISTS_API_BASE_URI}/users/${userId}/playlists`, {
            name,
            description
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.createPlaylist()", e))
    }

    static async editPlaylist(
        playlistId,
        name,
        description
    ) {
        return axios.put(`${PLAYLISTS_API_BASE_URI}/playlists/${playlistId}`, {
            name,
            description
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.editPlaylist()", e))
    }

    static async deletePlaylist(
        playlistId
    ) {
        return axios.delete(`${PLAYLISTS_API_BASE_URI}/playlists/${playlistId}/followers`)
            .then(response => response.data)
            .catch(e => console.error("PlaylistRepository.deletePlaylist()", e))
    }
}