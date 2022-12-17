<template>
    <main>
        <div app class="bg-red-100 primary" dark>
            <div align="center">
                <div class="d-flex">
                    <h1 v-on:click="goToHome">Metafy</h1>
                </div>
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
                        <template >
                            {{ " with Spotify" }}
                        </template>
                    </button>
                </div>
            </div>
        </div>

        <notifications group="main" position="top center" style="top: 75px"/>

        <div class="main">
            <router-view/>
        </div>

        <div>
            <div justify="space-between" class="ma-0">
                <div cols="auto" class="pa-0">
                    <div @click="goToGithub" class="cursor-pointer">
                        <div>mdi-github</div>
                        Github
                    </div>
                </div>
                <div cols="auto"  class="pa-0">
                    <div @click="goToPortfolio" class="cursor-pointer">
                        <div>mdi-smart-card</div>
                        Portfolio
                    </div>
                </div>
            </div>
        </div>
    </main>
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

.dark-background {
    background-color: #1E1E1E;
}

.cursor-pointer {
    cursor: pointer;
}

.main {
    background: rgb(25,118,210);
    background: linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(29,185,84,0.9) 100%);
}
</style>
