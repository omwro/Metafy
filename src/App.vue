<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-row align="center">
                <v-col class="d-flex">
                    <h1 v-on:click="goToHome">
                        <template v-if="$vuetify.breakpoint.name === 'xs'">
                            M
                        </template>
                        <template v-else>
                            Metafy
                        </template>
                    </h1>
                    <v-icon @click="goToGithub" class="ml-2">mdi-github</v-icon>
                </v-col>
                <v-col v-if="isLoggedIn()" class="text-center">
                    <small class="mr-1">{{ getRefreshedOn() }}</small>
                    <v-icon @click="refresh" :disabled="isRefreshing">mdi-refresh</v-icon>
                </v-col>
                <v-col class="text-right">
                    <v-btn v-if="isLoggedIn()" v-on:click="logout">
                        Hi
                        <template v-if="$vuetify.breakpoint.name !== 'xs'">
                            {{ getUser() ? getUser().display_name : "user" }}
                        </template>
                    </v-btn>
                    <v-btn v-else v-on:click="login">
                        Login
                        <template v-if="$vuetify.breakpoint.name !== 'xs'">
                            {{" with Spotify"}}
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
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
