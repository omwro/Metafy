<template>
    <div class="pa-0">
        <div>
            <div cols="auto" class="py-0">
                <div class="playlist-container-title dark-background">Quick tools</div>
            </div>
        </div>
        <div justify="center">
            <div cols="auto">
                <div class="pa-1">
                    <div cols="12" class="text-center pa-0">
                        <div v-on:click="goToSpotify" class="spotify-text-color">
                            mdi-spotify
                        </div>
                    </div>
                    <div cols="12" class="pa-0 text-center">
                        <small>Open Spotify</small>
                    </div>
                </div>
            </div>
            <div cols="auto">
                <div class="pa-1">
                    <div cols="12" class="text-center pa-0">
                        <div
                            color="primary"
                            v-on:click="refreshDynamicPlaylists"
                            :disabled="isRefreshingDynamics"
                        >
                            mdi-refresh
                        </div>
                    </div>
                    <div cols="12" class="pa-0 text-center">
                        <small>Refresh Dynamic playlist</small>
                    </div>
                </div>
            </div>
            <div cols="auto">
                <div class="pa-1">
                    <div cols="12" class="text-center pa-0">
                        <div
                            color="primary"
                            v-on:click="showCreatePlaylistDialog"
                        >
                            mdi-plus
                        </div>
                    </div>
                    <div cols="12" class="pa-0 text-center">
                        <small>New Dynamic playlist</small>
                    </div>
                </div>
            </div>
        </div>

        <CreateDynamicPlaylistDialog ref="createDynamicPlaylistDialog" />
    </div>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService";
import store from "@/store/store";
import CreateDynamicPlaylistDialog from "@/components/CreateDynamicPlaylistDialog";

export default {
    name: "QuickTools",
    components: {CreateDynamicPlaylistDialog},
    data: () => ({
        isRefreshingDynamics: false
    }),
    methods: {
        async fetchPlaylists() {
            await SpotifyService.fetchEverything()
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your playlists are fetched.",
                duration: 5000,
            })
        },
        async refreshDynamicPlaylists() {
            this.isRefreshingDynamics = true
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists());
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your Dynamic playlists are refreshed.",
                duration: 5000,
            })
            await this.fetchPlaylists();
            this.isRefreshingDynamics = false
        },
        showCreatePlaylistDialog() {
            this.$refs.createDynamicPlaylistDialog.dialog = true
        },
        goToSpotify() {
            window.open("https://open.spotify.com/")
        },
    }
}
</script>

<style scoped>

</style>