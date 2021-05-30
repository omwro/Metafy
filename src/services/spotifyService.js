import axios from 'axios';
import store from "@/store/store";
import {SpotifyAuthService} from "@/services/spotifyAuthService.js";

const TAG_REGEX = /\[.*?\]/g;

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
        const categoryName = playlist.name.match(TAG_REGEX)[0].slice(1, -1);
        const tagName = playlist.name.substring(playlist.name.match(TAG_REGEX)[0].length)
        return {categoryName, tagName};
    }
}