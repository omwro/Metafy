<template>
    <v-dialog
        v-model="dialog"
        max-width="600px"
        v-if="playlist"
    >
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col>
                        <v-chip class="mr-2">[{{ playlist.category }}]</v-chip>
                    </v-col>
                    <v-col class="text-right">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    class="mx-2 blue--text"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="redirect()"
                                >
                                    mdi-open-in-new
                                </v-icon>
                            </template>
                            <span>Redirect to Spotify</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="playlist.category === DYNAMIC">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    class="mx-2 green--text"
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
                                >
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete the playlist</span>
                        </v-tooltip>
                    </v-col>
                    <v-col cols="12">
                        <span class="text-h5">{{ playlist.tag }}</span>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text class="pt-5">
                <v-row>
                    <v-col cols="12">
                        <v-chip
                            class="ma-1"
                            v-for="(dep, i) in playlist.dependency"
                            :key="i"
                            :label="!isInstanceOfPlaylist(dep)"
                        >
                            {{ isInstanceOfPlaylist(dep) ? dep.name : dep }}
                        </v-chip>
                    </v-col>
                    <v-col cols="12" v-for="(song, i) in playlist.songs" :key="i">
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

export default {
    name: 'PlayListDetailDialog',
    components: {EditDynamicPlaylistDialog, SongCard},
    data: () => ({
        dialog: false,
        playlist: undefined,
        DYNAMIC: DYNAMIC
    }),
    methods: {
        isInstanceOfPlaylist(obj) {
            return obj instanceof Playlist
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
    }
}
</script>

<style lang="scss">
</style>
