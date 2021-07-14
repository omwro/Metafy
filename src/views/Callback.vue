<template>
    <h1>Processing your authentication....</h1>
</template>

<script>
import {SpotifyAuthService} from "@/spotify/spotifyAuthService.js";
import store from "@/store/store";
import Home from "@/views/Home";
import {SpotifyService} from "@/spotify/spotifyService";

export default {
    name: 'Callback',
    async created() {
        const authorizationCode = new URLSearchParams(window.location.search).get("code");
        const authorizationState = new URLSearchParams(window.location.search).get("state");

        store.commit("authorizationCode", authorizationCode);
        store.commit("authorizationState", authorizationState);

        if (authorizationCode && store.state.codeVerifier) {
            await SpotifyAuthService.fetchAccessToken(authorizationCode, store.state.codeVerifier)

            await SpotifyService.fetchEverything()

            await this.$router.push(Home);
        }
    },
}
</script>
