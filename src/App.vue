<template>
    <main class="bg-main text-white">
        <nav class="h-16 bg-nav flex flex-row justify-between">
            <h1 class="text-4xl" v-on:click="goToHome">Metafy</h1>
            <div v-if="isLoggedIn()" class="text-center">
                <small class="mr-1">{{ getRefreshedOn() }}</small>
                <div @click="refresh" :disabled="isRefreshing">mdi-refresh</div>
            </div>
            <div class="text-right">
                <button v-if="isLoggedIn()" v-on:click="logout">
                    Hi
                    <template>
                        {{ getUser() ? getUser().display_name : "user" }}
                    </template>
                </button>
                <button v-else v-on:click="login">
                    Login
                    <template>
                        {{ " with Spotify" }}
                    </template>
                </button>
            </div>
        </nav>

        <notifications group="main" position="top center" style="top: 75px"/>

        <div>
            <router-view/>
        </div>

        <footer class="flex justify-between">
            <div @click="goToGithub" class="cursor-pointer">
                <div>mdi-github</div>
                Github
            </div>
            <div @click="goToPortfolio" class="cursor-pointer">
                <div>mdi-smart-card</div>
                Portfolio
            </div>
        </footer>
    </main>
</template>

<script>
import moment from "moment";
import store from "/src/store/store";
import Home from "/src/views/Home";
import {SpotifyAuthService} from "/src/spotify/spotifyAuthService.js";
import {SpotifyService} from "/src/spotify/spotifyService";

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
            return store.getters.isLoggedIn();
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
        },
        goToPortfolio() {
            window.open("https://omererdem.nl")
        },
    }
};
</script>

<style lang="scss">
.spotify-text-color {
    color: #1DB954 !important;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
