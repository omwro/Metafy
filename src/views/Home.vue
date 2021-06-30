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
                    <v-icon v-on:click="openCreatePlaylistDialog">
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
                            {{ subPl.tag }}
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
                    @click="playlistDetailDialog = true; selectedPlaylist = pl"
                >
                    {{ pl.name }}
                </v-chip>
            </v-col>
        </v-row>

        <v-dialog
            v-model="createPlaylistDialog"
            max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <span class="text-h5">Create a dynamic playlist</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="createPlaylistDialogName"
                                    label="Playlist name *"
                                    hint="The playlist name without the category."
                                    required
                                />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    :value="getCombinationString()"
                                    label="Playlist combination *"
                                    disabled
                                />
                            </v-col>
                            <v-col cols="2">
                                <v-btn :disabled="!dialogOperatorToggle"
                                       @click="combination.push('+');toggleDialogCombination()" block>+
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn :disabled="!dialogOperatorToggle"
                                       @click="combination.push('-');toggleDialogCombination()" block>-
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn :disabled="!dialogOperatorToggle"
                                       @click="combination.push('=');toggleDialogCombination()" block>=
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn disabled
                                       @click="combination.push('(');toggleDialogCombination()" block>(
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn disabled
                                       @click="combination.push(')');toggleDialogCombination()" block>)
                                </v-btn>
                            </v-col>
                            <v-col cols="2">
                                <v-btn :disabled="combination.length === 0"
                                       @click="combination.pop();toggleDialogCombination()" block>
                                    <v-icon>mdi-keyboard-backspace</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="dialogChipContainer">
                                <v-chip
                                    v-for="pl in $store.state.playlists"
                                    :key="pl.id"
                                    :disabled="!dialogTagToggle"
                                    @click="combination.push(pl);toggleDialogCombination()"
                                    class="playlist-chip"
                                >
                                    {{ pl.name }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="closeCreatePlaylistDialog"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        :disabled="!dialogOperatorToggle"
                        @click="saveCreatePlaylistDialog"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <PlayListDetailDialog ref="playlistDetailDialog" />

    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService.js";
import store from "@/store/store";
import {getDependencyStringFromList} from "@/utilities/Dependency";
import {Playlist} from "@/models/Playlist";
import PlayListDetailDialog from "@/components/PlaylistDetailDialog";

export default {
    name: 'Home',
    components: {PlayListDetailDialog},
    data: () => ({
        createPlaylistDialog: false,
        createPlaylistDialogName: "",
        dialogTagToggle: true,
        dialogOperatorToggle: false,
        combination: [],
        selectedPlaylist: undefined,
    }),
    created() {
        this.fetchPlaylists()
    },
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        async fetchPlaylists() {
            await SpotifyService.fetchEverything()
            console.log("DPLS:", store.getters.getDynamicPlaylists)
            console.log("TPLS:", store.getters.getTaggedPlaylists)
            console.log("UTPLS:", store.getters.getUntaggedPlaylists)
        },
        async refreshDynamicPlaylists() {
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists);
            await this.fetchPlaylists();
        },
        openCreatePlaylistDialog() {
            this.createPlaylistDialog = true
        },
        closeCreatePlaylistDialog() {
            this.createPlaylistDialog = false
        },
        async saveCreatePlaylistDialog() {
            this.closeCreatePlaylistDialog()
            await SpotifyService.createPlaylist(this.createPlaylistDialogName, getDependencyStringFromList(this.combination))
            await this.fetchPlaylists();
            await this.refreshDynamicPlaylists();
        },
        getCombinationString() {
            let string = ""
            this.combination.forEach((combination) => {
                if (combination.name !== undefined) string += combination.name
                else string += combination
            })
            return string
        },
        toggleDialogCombination() {
            this.dialogTagToggle = !this.dialogTagToggle
            this.dialogOperatorToggle = !this.dialogOperatorToggle
        },
        isInstanceOfPlaylist(obj) {
            return obj instanceof Playlist
        },
        showPlaylistDetailDialog(playlist) {
            this.$refs.playlistDetailDialog.playlist = playlist
            this.$refs.playlistDetailDialog.dialog = true
        }
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
