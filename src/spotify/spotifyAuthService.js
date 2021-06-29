import axios from 'axios';
import store from "@/store/store";
import moment from "moment";

export class SpotifyAuthService {

    static clientId = "e1e4a778c5bf4bf7b6be2ff48801f98c";
    static responseType = "code";
    static redirectUri = this.getCurrentWebsiteCallbackUri();
    static scope = "user-read-private playlist-read-private playlist-modify-public playlist-modify-private";
    static codeChallengeMethod = "S256";

    static async logout() {
        store.commit("resetState");
    }

    static async login() {
        const codeVerifier = this.generateCodeVerifier();
        const hashed = await this.sha256(codeVerifier);
        const codeChallenge = this.generateCodeChallenge(hashed);

        store.commit("codeVerifier", codeVerifier);
        store.commit("codeChallenge", codeChallenge);

        this.redirectToAuthorizationPage(codeChallenge);
    }

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

    static async fetchAccessToken(authorizationCode, codeVerifier) {
        return axios.post("https://accounts.spotify.com/api/token", null, {
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
            .then(async response => {
                store.commit("accessToken", response.data.access_token)
                store.commit("refreshToken", response.data.refresh_token)
                await this.getUserProfile();
                return response.data;
            })
            .catch(e => {
                console.error("SpotifyService", e)
            })
    }

    static async refreshAccessToken(refreshToken) {
        store.commit("accessToken", null)
        store.commit("refreshToken", null)
        store.commit("expiresIn", moment())
        return axios.post("https://accounts.spotify.com/api/token", null, {
            params: {
                client_id: this.clientId,
                grant_type: "refresh_token",
                refresh_token: refreshToken
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(async response => {
                store.commit("accessToken", response.data.access_token)
                store.commit("refreshToken", response.data.refresh_token)
                store.commit("expiresIn", moment().add(response.data.expires_in, "second"))
                await this.getUserProfile();
                return response.data
            })
            .catch(e => {
                console.error("SpotifyService", e)
            })
    }

    static isAccessTokenExpired() {
        return moment().isAfter(store.state.expiresIn) && store.state.accessToken
    }

    static async getUserProfile() {
        return axios.get("https://api.spotify.com/v1/me", {
            headers: {
                "Authorization": `Bearer ${store.state.accessToken}`
            }
        })
            .then(response => {
                store.commit("user", response.data)
                console.log("user", response.data)
                return response.data
            })
            .catch(e => {
                console.error("SpotifyService", e)
            })
    }
}