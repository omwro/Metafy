<template>
    <v-container v-if="isLoggedIn()">
        <h1>Let's vibe with Metafy!</h1>
    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import {SpotifyService} from "@/services/spotifyService.js";
import store from "@/store/store";

export default {
    name: 'Home',
    data: () => ({
        playlists: []
    }),
    created() {
        SpotifyService.fetchPlaylists();
    },
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        }
    }
}
</script>
