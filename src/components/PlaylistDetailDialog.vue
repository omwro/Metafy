<template>
    <v-dialog
        v-model="dialog"
        max-width="600px"
        v-if="playlist"
    >
        <v-card>
            <v-card-title class="pa-3">
                <v-row>
                    <v-col>
                        <TagChip
                            :category="playlist.category"
                            class="mr-2"
                        />
                    </v-col>
                    <v-col class="text-right">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    class="mx-2 spotify-text-color"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="redirect()"
                                >
                                    mdi-spotify
                                </v-icon>
                            </template>
                            <span>Redirect to Spotify</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="playlist.category === DYNAMIC">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    color="primary"
                                    class="mx-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="showEditPlaylistDialog()"
                                >
                                    mdi-lead-pencil
                                </v-icon>
                            </template>
                            <span>Edit the playlist</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    class="mx-2 red--text"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="deletePlaylist"
                                >
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete the playlist</span>
                        </v-tooltip>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <span class="text-h5">{{ playlist.tag }}</span>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-row>
                    <v-col cols="12" v-if="playlist.dependency.length">
                        <TagChip
                            class="ma-1"
                            v-for="(dep, i) in playlist.dependency"
                            :key="i"
                            :playlist="dep"
                            :category="dep.category"
                            :isOperator="!isInstanceOfPlaylist(dep)"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        v-for="(song, i) in playlist.songs"
                        :key="i"
                        class="pb-0"
                    >
                        <SongCard :song="song"/>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>

        <EditDynamicPlaylistDialog ref="editDynamicPlaylistDialog"/>
    </v-dialog>
</template>

<script>
import SongCard from "@/components/SongCard";
import {Playlist} from "@/models/Playlist";
import EditDynamicPlaylistDialog from "@/components/EditDynamicPlaylistDialog";
import {DYNAMIC} from "@/store/store";
import {SpotifyService} from "@/spotify/spotifyService";
import TagChip from "@/components/TagChip";

export default {
    name: 'PlayListDetailDialog',
    components: {TagChip, EditDynamicPlaylistDialog, SongCard},
    data: () => ({
        dialog: false,
        playlist: undefined,
        DYNAMIC: DYNAMIC
    }),
    methods: {
        isInstanceOfPlaylist(obj) {
            return Playlist.isInstance(obj)
        },
        redirect() {
            window.open(this.playlist.externalUrl)
        },
        showEditPlaylistDialog() {
            this.dialog = false
            this.$refs.editDynamicPlaylistDialog.playlist = this.playlist
            this.$refs.editDynamicPlaylistDialog.playlistName = this.playlist.tag
            this.$refs.editDynamicPlaylistDialog.combination = this.playlist.dependency
            this.$refs.editDynamicPlaylistDialog.dialog = true
        },
        async deletePlaylist() {
            await SpotifyService.deletePlaylist(this.playlist.id)
            this.dialog = false
            await SpotifyService.fetchEverything()
        },
    }
}
</script>

<style lang="scss">
</style>
