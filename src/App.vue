<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <h1 v-on:click="goToHome">Metafy</h1>
                <v-icon @click="goToGithub" class="ml-2">mdi-github</v-icon>
            </div>
            <v-spacer></v-spacer>
            <div v-if="isLoggedIn()">
                <small class="mr-1">{{ getRefreshedOn() }}</small>
                <v-icon @click="refresh" :disabled="isRefreshing">mdi-refresh</v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn v-if="isLoggedIn()" v-on:click="logout">Hi {{ getUser() ? getUser().display_name : "user" }}</v-btn>
            <v-btn v-else v-on:click="login">Login with Spotify</v-btn>
        </v-app-bar>

        <notifications group="main" position="top center" style="top: 64px"/>

        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
import {SpotifyAuthService} from "@/spotify/spotifyAuthService.js";
import store from "@/store/store";
import Home from "@/views/Home";
import {SpotifyService} from "@/spotify/spotifyService";
import moment from "moment";

export default {
    name: 'App',
    data: () => ({
        isRefreshing: false
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
        getUser() {
            return store.state.user;
        },
        async login() {
            await SpotifyAuthService.login();
        },
        async logout() {
            await SpotifyAuthService.logout();
        },
        async refresh() {
            this.isRefreshing = true
            await SpotifyService.fetchEverything()
            console.log("DPLS:", store.getters.getDynamicPlaylists)
            console.log("TPLS:", store.getters.getTaggedPlaylists)
            console.log("UTPLS:", store.getters.getUntaggedPlaylists)
            this.$notify({
                group: 'main',
                type: 'success',
                title: "All data successfully fetched.",
                duration: 5000,
            })
            this.isRefreshing = false
        },
        getRefreshedOn() {
            return store.state.refreshedOn ? moment(store.state.refreshedOn).format("DD-MM-yy HH:mm") : ""
        },
        goToGithub() {
            window.open("https://github.com/omwro/metafy-vue")
        }
    }
};
</script>
