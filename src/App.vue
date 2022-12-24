<template>
    <main class="text-white">
        <nav class="h-16 bg-nav fixed w-full flex flex-row justify-between px-4 items-center">
            <h1 class="text-4xl" v-on:click="goToHome">Metafy</h1>
            <div v-if="isLoggedIn()" class="text-center flex flex-row items-center">
                <div class="mr-2 flex flex-col">
                    <small>Last synchronize: </small>
                    <small>{{ getRefreshedOn() }}</small>
                </div>
                <font-awesome-icon icon="fa-solid fa-rotate cursor-pointer"
                                   @click="refresh"
                                   :disabled="isRefreshing"/>
            </div>
            <div>
                <button v-if="isLoggedIn()" v-on:click="logout" class="text-right bg-block px-4 py-2 rounded hover:bg-light">
                    Hi
                    <template>
                        {{ getUser() ? getUser().display_name : "user" }}
                    </template>
                </button>
                <button v-else v-on:click="login" class="text-right bg-block px-4 py-2 rounded hover:bg-light">
                    Login
                    <template>
                        {{ " with Spotify" }}
                    </template>
                </button>
            </div>
        </nav>

        <notifications group="main" position="top center" style="top: 75px"/>

        <div class="pt-16">
            <router-view/>
        </div>
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
            location.reload();
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
            return store.state.refreshedOn ? moment(store.state.refreshedOn).fromNow() : ""
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
html, body {
    @apply bg-main
}
</style>
