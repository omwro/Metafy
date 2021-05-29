<template>
    <h1>Processing your authentication....</h1>
</template>

<script>
import {SpotifyAuthService} from "@/services/spotifyAuthService.js";
import store from "@/store/store";
import Home from "@/views/Home";

export default {
    name: 'Callback',
    created() {
        const authorizationCode = new URLSearchParams(window.location.search).get("code");
        const authorizationState = new URLSearchParams(window.location.search).get("state");

        store.commit("authorizationCode", authorizationCode);
        store.commit("authorizationState", authorizationState);

        console.log(authorizationCode)
        console.log(store.state.codeVerifier)
        if (authorizationCode && store.state.codeVerifier) {
            SpotifyAuthService.fetchAccessToken(authorizationCode, store.state.codeVerifier)
            .then(() => {
                this.$router.push(Home);
            });
        }
    }
}
</script>
