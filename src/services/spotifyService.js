import axios from 'axios';
import store from "@/store/store";
import {SpotifyAuthService} from "@/services/spotifyAuthService.js";

export class SpotifyService {
    static async fetchPlaylists() {
        if (SpotifyAuthService.isAccessTokenExpired()){
            await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        }

        return axios.get("https://api.spotify.com/v1/me/playlists?limit=50")
            .then(response => {
                store.commit("playlists", response.data.items);
                console.log("User Playlists fetched", response.data)
                return response.data.items;
            })
            .catch(e => {
                console.error("SpotifyService", e)
            })
    }

    static splitPlaylistFromTags(playlists) {
        const regex = /\[.*?\]/g;
        let playlistsWithTags = [];
        let playlistsWithoutTags = [];
        for (let pl of playlists) {
            const match = pl.name.match(regex);
            if (match) {
                // Get first match of the regex and remove the squared brackets
                const firstMatch = match[0].slice(1, -1);
                if (!playlistsWithTags.filter((obj) => obj.tag === firstMatch).length) {
                    playlistsWithTags.push({
                        tag: firstMatch,
                        playlists: []
                    })
                }
                playlistsWithTags
                    .filter((obj) => obj.tag === firstMatch)[0]
                    .playlists
                    .push(pl)
            } else {
                playlistsWithoutTags.push(pl);
            }
        }
        return {
            withTags: playlistsWithTags,
            withoutTags: playlistsWithoutTags
        };
    }
}