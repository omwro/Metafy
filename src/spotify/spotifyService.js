import store from "@/store/store";
import {SpotifyAuthService} from "@/spotify/spotifyAuthService.js";
import {SpotifyRepository} from "@/spotify/spotifyRepository";
import {SpotifyMultiRequestHandler} from "@/spotify/spotifyMultiRequestHandler";

const TAG_REGEX = /\[.*?\]/g;

export class SpotifyService {

    static async fetchPlaylists() {
        if (SpotifyAuthService.isAccessTokenExpired()){
            await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        }
        const playlists = await SpotifyMultiRequestHandler.fetchAllCurrentUserPlaylists();
        store.commit("playlists", playlists);
        return playlists;
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
                    console.log(pl)
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
        if (SpotifyAuthService.isAccessTokenExpired()){
            await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        }

        let refreshedPlaylist = [];
        for (let pl of playlists) {
            const oldTracks = await SpotifyMultiRequestHandler.fetchAllPlaylistTracks(pl.id);
            console.log("oldtracks",  oldTracks);

            if (oldTracks.length) {
                const oldTrackUris = oldTracks.map((t) => {return { uri: t.track.uri}})
                await SpotifyMultiRequestHandler.deleteAllPlaylistTracks(pl.id, oldTrackUris)
            }

            const tagPlaylistId = pl.description.split(",")
            for (let id of tagPlaylistId) {
                const newTracks = await SpotifyMultiRequestHandler.fetchAllPlaylistTracks(id);
                console.log("newTracks", newTracks);
                if (newTracks.length) {
                    const newTrackUris = newTracks.map((t) => t.track.uri)
                    await SpotifyMultiRequestHandler.addAllPlaylistTracks(pl.id, newTrackUris)
                }
            }

            const newPlaylist = await SpotifyRepository.fetchPlaylist(pl.id)
            refreshedPlaylist.push(newPlaylist)
        }
        console.log("refreshed", refreshedPlaylist)
        return refreshedPlaylist;
    }
}