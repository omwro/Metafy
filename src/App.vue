<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <h1 v-on:click="goToHome">Metafy</h1>
            </div>
            <v-spacer></v-spacer>
            <v-container v-if="isLoggedIn()">
                <v-btn v-on:click="getAuth">Hi user</v-btn>
            </v-container>
            <v-container v-else>
                <v-btn v-on:click="getAuth">Login with Spotify</v-btn>
            </v-container>
        </v-app-bar>

        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
import axios from 'axios';
import {SpotifyAuthService} from "@/spotify/spotifyAuthService.js";
import store from "@/store/store";
import Home from "@/views/Home";

if (store.state.accessToken && store.state.refreshToken) {
    axios.interceptors.request.use(function (config) {
        config.headers.Authorization = "Bearer "+store.state.accessToken;
        return config;
    });

    // axios.interceptors.response.use((response) => {
    //     return response;
    // }, (error) => {
    //     console.log("Error response", error.response)
    //     if (error.response.status === 401) {
    //        SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
    //         .then(() => this.$router.push(Home));
    //     } else {
    //         return new Promise(((resolve, reject) => reject(error)));
    //     }
    // })
}

export default {
    name: 'App',
    data: () => ({
        //
    }),
    created() {

    },
    methods: {
        goToHome() {
          this.$router.push(Home);
        },
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        async getAuth() {
            const codeVerifier = SpotifyAuthService.generateCodeVerifier();
            const hashed = await SpotifyAuthService.sha256(codeVerifier);
            const codeChallenge = SpotifyAuthService.generateCodeChallenge(hashed);

            store.commit("codeVerifier", codeVerifier);
            store.commit("codeChallenge", codeChallenge);

            SpotifyAuthService.redirectToAuthorizationPage(codeChallenge);
        }
    }
};
</script>
