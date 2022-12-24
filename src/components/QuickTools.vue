<template>
    <section class="p-4 flex justify-center relative">
        <div class="absolute bg-block border rounded-xl px-2">Quick tools</div>
        <div class="flex flex-row gap-4 bg-block w-max p-4 border rounded-xl mt-3 pt-6">
            <a href="https://open.spotify.com/"
               target="_blank"
               rel="noopener"
               class="flex flex-col text-center gap-1 cursor-pointer">
                <font-awesome-icon icon="fa-brands fa-spotify" class="text-green" />
                <small>Open Spotify</small>
            </a>
            <div class="flex flex-col text-center gap-1 cursor-pointer" @click="refreshDynamicPlaylists">
                <font-awesome-icon icon="fa-solid fa-rotate" class="text-green" />
                <small>Dynamify playlists</small>
            </div>
            <div class="flex flex-col text-center gap-1 cursor-pointer" @click="$router.push({name:'NewPlaylist'})">
                <font-awesome-icon icon="fa-solid fa-plus" class="text-green" />
                <small>New playlist</small>
            </div>
        </div>
    </section>
</template>

<script>
import {SpotifyService} from "/src/spotify/spotifyService";
import store from "/src/store/store";

export default {
    name: "QuickTools",
    methods: {
        async refreshDynamicPlaylists() {
            store.commit("loading", true)
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists());
            await SpotifyService.fetchEverything()
            store.commit("loading", false)
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your Dynamic playlists are refreshed.",
                duration: 5000,
            })
        }
    }
}
</script>

<style scoped>

</style>