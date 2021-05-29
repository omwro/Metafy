import axios from 'axios';
import store from "@/store/store";
import Home from "@/views/Home";
// import {sha256} from 'js-sha256';

export class SpotifyService {

    static clientId = "e1e4a778c5bf4bf7b6be2ff48801f98c";
    static responseType = "code";
    static redirectUri = this.getCurrentWebsiteCallbackUri();
    static scope = "user-read-private playlist-read-private";
    static codeChallengeMethod = "S256";

    static getCurrentWebsiteCallbackUri() {
        let urlArray = window.location.href.split("/");
        return urlArray[0] + "//" + urlArray[2] + "/callback";
    }

    static generateCodeVerifier() {
        const result = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 64; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        return result.join('');
    }

    static sha256(codeVerifier) {
        // returns promise ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    static generateCodeChallenge(codeVerifier) {
        return btoa(String.fromCharCode
            .apply(null, new Uint8Array(codeVerifier)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static redirectToAuthorizationPage(codeChallenge) {
        window.location.replace(
            "https://accounts.spotify.com/authorize" +
            "?client_id=" + this.clientId +
            "&response_type=" + this.responseType +
            "&redirect_uri=" + this.redirectUri +
            "&scope=" + this.scope +
            "&code_challenge_method=" + this.codeChallengeMethod +
            "&code_challenge=" + codeChallenge
        );
    }

    static fetchAccessToken(authorizationCode, codeVerifier) {
        axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                client_id: this.clientId,
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: this.redirectUri,
                code_verifier: codeVerifier
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => {
                store.commit("accessToken", response.data.access_token)
                store.commit("refreshToken", response.data.refresh_token)
                this.$router.push(Home);
            })
            .catch(e => {
                console.error("SpotifyService",e)
            })
    }

     static async fetchPlaylists() {
        axios.get("https://api.spotify.com/v1/me/playlists?limit=50")
            .then(response => {
                store.commit("playlists", response.data.items);
                console.log("User Playlists fetched", response.data)
                return response.data.items;
            })
            .catch(e => {
                console.error("SpotifyService",e)
            })
    }
}