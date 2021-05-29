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
import {SpotifyService} from "@/services/spotifyService.js";
import store from "@/store/store";
import Home from "@/views/Home";

if (store.state.accessToken) {
    axios.interceptors.request.use(function (config) {
        config.headers.Authorization = "Bearer "+store.state.accessToken;
        return config;
    });
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
            const codeVerifier = SpotifyService.generateCodeVerifier();
            const hashed = await SpotifyService.sha256(codeVerifier);
            const codeChallenge = SpotifyService.generateCodeChallenge(hashed);

            store.commit("codeVerifier", codeVerifier);
            store.commit("codeChallenge", codeChallenge);

            SpotifyService.redirectToAuthorizationPage(codeChallenge);
        }
    }
};
</script>
