<template>
    <v-container v-if="isLoggedIn()">
        <v-row>
            <v-col>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto" class="playlist-container">
                <v-row>
                    <v-col cols="auto" class="py-0">
                        <div class="playlist-container-title">Quick tools</div>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="auto">
                        <v-row justify="center" class="pa-1">
                            <v-col cols="12" class="text-center pa-0">
                                <v-icon
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
                        <v-row justify="center" class="pa-1">
                            <v-col cols="12" class="text-center pa-0">
                                <v-icon v-on:click="showCreatePlaylistDialog">
                                    mdi-plus
                                </v-icon>
                            </v-col>
                            <v-col cols="12" class="pa-0 text-center">
                                <small>New Dynamic playlist</small>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">
                    Your dynamic playlists
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container">
                <v-card
                    v-for="pl in $store.getters.getDynamicPlaylists"
                    :key="pl.id"
                    @click="showPlaylistDetailDialog(pl)"
                >
                    <v-card-title>
                            {{ pl.tag }} ({{ pl.songs.length }})
                    </v-card-title>
                    <v-card-text>
                        <v-chip
                            v-for="subPl in pl.subtags"
                            :key="subPl.id"
                            class="playlist-chip"
                        >
                            {{ subPl.name }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">Your tagged playlists</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                v-for="tpl in $store.getters.getTaggedPlaylists"
                :key="tpl.category"
            >
                <v-row>
                    <v-col>
                        <h3 class="text-center">{{ tpl.category }}</h3>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col

                        class="playlist-container"
                    >
                        <v-chip
                            v-for="pl in tpl.playlists"
                            :key="pl.id"
                            class="playlist-chip"
                            @click="showPlaylistDetailDialog(pl)"
                        >
                            {{ pl.tag }}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">Your untagged playlists</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container">
                <v-chip
                    v-for="pl in $store.getters.getUntaggedPlaylists"
                    :key="pl.id"
                    class="playlist-chip"
                    @click="showPlaylistDetailDialog(pl)"
                >
                    {{ pl.name }}
                </v-chip>
            </v-col>
        </v-row>

        <CreateDynamicPlaylistDialog ref="createDynamicPlaylistDialog" />

        <PlayListDetailDialog ref="playlistDetailDialog" />

    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService.js";
import store from "@/store/store";
import {Playlist} from "@/models/Playlist";
import PlayListDetailDialog from "@/components/PlaylistDetailDialog";
import CreateDynamicPlaylistDialog from "@/components/CreateDynamicPlaylistDialog";

export default {
    name: 'Home',
    components: {CreateDynamicPlaylistDialog, PlayListDetailDialog},
    data: () => ({
        createPlaylistDialog: false,
        createPlaylistDialogName: "",
        dialogTagToggle: true,
        dialogOperatorToggle: false,
        combination: [],
        selectedPlaylist: undefined,
        isRefreshingDynamics: false
    }),
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
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
        isInstanceOfPlaylist(obj) {
            return Playlist.isInstance(obj)
        },
        showPlaylistDetailDialog(playlist) {
            this.$refs.playlistDetailDialog.playlist = playlist
            this.$refs.playlistDetailDialog.dialog = true
        },
        showCreatePlaylistDialog() {
            this.$refs.createDynamicPlaylistDialog.dialog = true
        },
    }
}
</script>

<style scoped lang="scss">
.playlist-container {
    margin: 0 12px 12px;
    padding: 8px;
    border: solid 1px black;
    border-radius: 5px;

    .playlist-container-title {
        width: 100px;
        margin-top: -10px;
        background: white;
        text-align: center;
    }
}

.playlist-chip {
    margin: 4px;
}

.dialogChipContainer {
    max-height: 150px;
    overflow-y: scroll;
}
</style>
