<template>
    <v-container v-if="isLoggedIn()">
        <v-row>
            <v-col>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">
                    Your dynamic playlists
                    <v-icon v-on:click="refreshDynamicPlaylists">
                        mdi-refresh
                    </v-icon>
                    <v-icon v-on:click="showCreatePlaylistDialog">
                        mdi-plus
                    </v-icon>
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
    }),
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        async fetchPlaylists() {
            await SpotifyService.fetchEverything()
            console.log("DPLS:", store.getters.getDynamicPlaylists)
            console.log("TPLS:", store.getters.getTaggedPlaylists)
            console.log("UTPLS:", store.getters.getUntaggedPlaylists)
            this.notifySuccess("All data successfully fetched.")
        },
        async refreshDynamicPlaylists() {
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists);
            this.notifySuccess("Dynamic playlist songs are refreshed.")
            await this.fetchPlaylists();
        },
        isInstanceOfPlaylist(obj) {
            return obj instanceof Playlist
        },
        showPlaylistDetailDialog(playlist) {
            this.$refs.playlistDetailDialog.playlist = playlist
            this.$refs.playlistDetailDialog.dialog = true
        },
        showCreatePlaylistDialog() {
            this.$refs.createDynamicPlaylistDialog.dialog = true
        },
        notifySuccess(title) {
            this.$notify({
                group: 'main',
                type: 'success',
                title: title,
                duration: 5000,
            })
        },
    }
}
</script>

<style scoped lang="scss">
.playlist-container {
    margin: 0 12px;
    padding: 8px;
    border: solid 1px black;
}

.playlist-chip {
    margin: 4px;
}

.dialogChipContainer {
    max-height: 150px;
    overflow-y: scroll;
}
</style>
