<template>
    <div
        max-width="600px"
        v-if="playlist"
    >
        <div>
            <div class="pa-3">
                <div>
                    <div cols="auto">
                        <TagChip
                            :category="playlist.category"
                            :playlist="playlist"
                            class="mr-2"
                        />
                    </div>
                    <div/>
                    <div cols="auto" class="text-no-wrap">
                        <div bottom>
                                <div
                                    class="mx-2 spotify-text-color"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="redirect()"
                                >
                                    mdi-spotify
                                </div>
                            <span>Redirect to Spotify</span>
                        </div>
                        <div bottom v-if="playlist.category === DYNAMIC">
                                <div
                                    color="primary"
                                    class="mx-2"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="showEditPlaylistDialog()"
                                >
                                    mdi-lead-pencil
                                </div>
                            <span>Edit the playlist</span>
                        </div>
                        <div bottom>
                                <div
                                    class="mx-2 red--text"
                                    v-on="on"
                                    v-bind="attrs"
                                    @click="deletePlaylist"
                                >
                                    mdi-delete
                                </div>
                            <span>Delete the playlist</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pa-3">
                <div>
                    <div cols="12" v-if="playlist.dependency.length">
                        <TagChip
                            class="ma-1"
                            v-for="(dep, i) in playlist.dependency"
                            :key="i"
                            :playlist="dep"
                            :category="dep.category"
                            :isOperator="!isInstanceOfPlaylist(dep)"
                        />
                    </div>
                    <div
                        cols="12"
                        v-for="(song, i) in playlist.songs"
                        :key="i"
                        class="pb-0"
                    >
                        <SongCard :song="song"/>
                    </div>
                </div>
            </div>
            <div>
                <div></div>
                <button
                    color="blue darken-1"
                    text
                    @click="dialog = false"
                >
                    Close
                </button>
            </div>
        </div>

        <EditDynamicPlaylistDialog ref="editDynamicPlaylistDialog"/>
    </div>
</template>

<script>
import SongCard from "@/components/SongCard";
import {Playlist} from "@/models/Playlist";
import EditDynamicPlaylistDialog from "@/components/EditDynamicPlaylistDialog";
import {DYNAMIC} from "/src/store";
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
