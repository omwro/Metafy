<template>
    <v-container class="pa-0">
        <v-row>
            <v-col cols="auto" class="py-0">
                <div class="playlist-container-title">Quick tools</div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto">
                <v-row class="pa-1">
                    <v-col cols="12" class="text-center pa-0">
                        <v-icon v-on:click="goToSpotify" class="spotify-text-color">
                            mdi-spotify
                        </v-icon>
                    </v-col>
                    <v-col cols="12" class="pa-0 text-center">
                        <small>Open Spotify</small>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="auto">
                <v-row class="pa-1">
                    <v-col cols="12" class="text-center pa-0">
                        <v-icon
                            color="primary"
                            v-on:click="refreshDynamicPlaylists"
                            :disabled="isRefreshingDynamics"
                        >
                            mdi-refresh
                        </v-icon>
                    </v-col>
                    <v-col cols="12" class="pa-0 text-center">
                        <small>Refresh Dynamic playlist</small>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="auto">
                <v-row class="pa-1">
                    <v-col cols="12" class="text-center pa-0">
                        <v-icon
                            color="primary"
                            v-on:click="showCreatePlaylistDialog"
                        >
                            mdi-plus
                        </v-icon>
                    </v-col>
                    <v-col cols="12" class="pa-0 text-center">
                        <small>New Dynamic playlist</small>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <CreateDynamicPlaylistDialog ref="createDynamicPlaylistDialog" />
    </v-container>
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
        },
        async refreshDynamicPlaylists() {
            this.isRefreshingDynamics = true
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists);
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your new playlist is created.",
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