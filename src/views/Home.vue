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
                    v-for="pl in playlists.dynamics"
                    :key="pl.id"
                >
                    <v-card-title>{{ pl.metafy.tagName }}</v-card-title>
                    <v-card-text>
                        <v-chip
                            v-for="subPl in pl.metafy.subTags"
                            :key="subPl.id"
                            class="playlist-chip"
                        >
                            {{ subPl.metafy.tagName }}
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
                v-for="plwt in playlists.tags"
                :key="plwt.categoryName"
            >
                <v-row>
                    <v-col>
                        <h3 class="text-center">{{ plwt.categoryName }}</h3>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col

                        class="playlist-container"
                    >
                        <v-chip
                            v-for="pl in plwt.playlists"
                            :key="pl.id"
                            class="playlist-chip"
                        >
                            {{ pl.metafy.tagName }}
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
                    v-for="pl in playlists.others"
                    :key="pl.id"
                    class="playlist-chip"
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
                            <v-col>
                                <v-text-field
                                    label="Playlist name*"
                                    hint="The playlist name without the category."
                                    required
                                />
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
                        @click="saveCreatePlaylistDialog"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService.js";
import store from "@/store/store";

export default {
    name: 'Home',
    data: () => ({
        playlists: [],
        createPlaylistDialog: false
    }),
    created() {
        this.fetchPlaylists()
    },
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        async fetchPlaylists() {
            SpotifyService.fetchPlaylists().then((result) => {
                console.log("FetchUserPlaylists", result);
                this.playlists = SpotifyService.convertPlaylist(result);
                console.log("Converted Playlist", this.playlists)
            });
        },
        async refreshDynamicPlaylists() {
            await SpotifyService.refreshDynamics(this.playlists.dynamics);
            await this.fetchPlaylists();
        },
        async openCreatePlaylistDialog() {
            this.createPlaylistDialog = true
        },
        async closeCreatePlaylistDialog() {
            this.createPlaylistDialog = false
        },
        async saveCreatePlaylistDialog() {
            await this.closeCreatePlaylistDialog()
        }
    }
}
</script>

<style scoped lang="scss">
.playlist-container {
    margin: 0 12px;
    padding: 8px;
    border: solid 1px black;

    .playlist-chip {
        margin: 4px;
    }
}
</style>
