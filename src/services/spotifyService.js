import axios from 'axios';
import store from "@/store/store";
import {SpotifyAuthService} from "@/services/spotifyAuthService.js";

const TAG_REGEX = /\[.*?\]/g;

export class SpotifyService {

    static async fetchPlaylists() {
        if (SpotifyAuthService.isAccessTokenExpired()){
            await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        }

        const playlists = [];
        const firstFetch = await axios.get("https://api.spotify.com/v1/me/playlists?limit=50")
        playlists.push(firstFetch.data.items);
        const total = firstFetch.data.total;
        const multiplier = Math.ceil(total / 50);
        for (let i = 1; i < multiplier; i++) {
            const otherFetch = await axios.get("https://api.spotify.com/v1/me/playlists?limit=50&offset="+i)
            playlists.push(otherFetch.data.items);
        }
        store.commit("playlists", playlists);
        return playlists

    }

    static convertPlaylist(playlists) {
        let playlistsWithDynamics = [];
        let playlistsWithTags = [];
        let playlistsWithoutTags = [];
        for (let pl of playlists) {
            pl["metafy"] = {
                categoryName: "",
                tagName: pl.name
            };

            if (pl.name.match(TAG_REGEX)) {
                const masterTag = this.getTagFromPlaylistName(pl);
                pl.metafy.categoryName = masterTag.categoryName;
                pl.metafy.tagName = masterTag.tagName;
                if (masterTag.categoryName === "Dynamic") {
                    playlistsWithDynamics.push(pl)
                } else {
                    if (!playlistsWithTags.filter((plwt) => plwt.categoryName === masterTag.categoryName).length) {
                        playlistsWithTags.push({
                            categoryName: masterTag.categoryName,
                            playlists: []
                        })
                    }
                    playlistsWithTags
                        .filter((plwt) => plwt.categoryName === masterTag.categoryName)[0]
                        .playlists
                        .push(pl)
                }
            } else {
                playlistsWithoutTags.push(pl);
            }
        }
        return {
            dynamics: playlistsWithDynamics,
            tags: playlistsWithTags,
            others: playlistsWithoutTags
        };
    }

    static getTagFromPlaylistName(playlist) {
        const categoryName = playlist.name.match(TAG_REGEX)[0].slice(1, -1).trim();
        const tagName = playlist.name.substring(playlist.name.match(TAG_REGEX)[0].length).trim()
        return {categoryName, tagName};
    }

    static async refreshDynamics(playlists) {
        let refreshedPlaylist = [];
        for (let pl of playlists) {
            const oldTracks = await this.fetchPlaylistTracks(pl.id);
            console.log("oldtracks",  oldTracks);

            if (oldTracks.items.length) {
                const oldTrackUris = oldTracks.items.map((t) => {return { uri: t.track.uri}})
                await this.deletePlaylistTracks(pl.id, oldTrackUris)
            }

            const tagPlaylistId = pl.description.split(",")
            for (let id of tagPlaylistId) {
                const newTracks = await this.fetchPlaylistTracks(id);
                console.log("newTracks", newTracks);
                if (newTracks.items.length) {
                    const newTrackUris = newTracks.items.map((t) => t.track.uri)
                    await this.addPlaylistTracks(pl.id, newTrackUris)
                }
            }

            const newPlaylist = await this.fetchPlaylist(pl.id)
            refreshedPlaylist.push(newPlaylist)
        }
        console.log("refreshed", refreshedPlaylist)
        return refreshedPlaylist;
    }

    static async fetchPlaylist(playlistId) {
        return axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`)
            .then(response => response.data)
            .catch(e => console.error("SpotifyService", e))
    }

    static async fetchPlaylistTracks(playlistId) {
        return axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`)
            .then(response => response.data)
            .catch(e => console.error("SpotifyService", e))
    }

    static async addPlaylistTracks(playlistId, trackUris) {
        return axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: trackUris
        },{
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.data)
            .catch(e => console.error("SpotifyService", e))
    }

    static async deletePlaylistTracks(playlistId, trackUris) {
        return axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                tracks: trackUris
            }
        })
            .then(response => response.data)
            .catch(e => console.error("SpotifyService", e))
    }
}