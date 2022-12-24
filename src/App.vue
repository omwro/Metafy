<template>
    <main class="text-white">
        <nav class="h-16 bg-nav fixed w-full flex flex-row justify-between px-4 items-center z-10">
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

        <div class="h-full w-full fixed top-0 left-0 z-20 bg-black bg-opacity-70"
             :class="$store.state.loading ? 'block' : 'hidden'">
            <font-awesome-icon icon="fa-solid fa-spinner" class="w-16 h-16 fa-spin absolute top-1/2 left-1/2" />
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
            store.commit("loading", true)
            await SpotifyService.fetchEverything()
            store.commit("loading", false)
            this.$notify({
                group: 'main',
                type: 'success',
                title: "All data successfully fetched.",
                duration: 5000,
            })
        },
        getRefreshedOn() {
            return store.state.refreshedOn ? moment(store.state.refreshedOn).fromNow() : ""
        }
    }
};
</script>

<style lang="scss">
html, body {
    @apply bg-main
}
</style>
