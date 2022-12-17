<template>
    <div
        max-width="600px"
        v-if="playlist"
    >
        <div>
            <div class="pa-3">
                <span class="text-h5">Edit playlist {{playlist.name}}</span>
            </div>
            <div class="pa-3">
                <div>
                    <div>
                        <div cols="12">
                            <input
                                v-model="playlistName"
                                label="Playlist name *"
                                hint="The playlist name without the category. "
                                required
                            />
                        </div>
                        <div cols="12" class="pb-0">
                            <input
                                :value="getCombinationString()"
                                label="Playlist combination *"
                                auto-grow
                                rows="1"
                                row-height="15"
                                disabled
                            />
                        </div>
                        <div cols="12" class="py-0">
                            <small>Max 13 playlists</small>
                        </div>
                        <div cols="3">
                            <button
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.PLUS)"
                                block
                            >
                                +
                            </button>
                        </div>
                        <div cols="3">
                            <button
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.MINUS)"
                                block
                            >
                                -
                            </button>
                        </div>
                        <div cols="3">
                            <button
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.EQUAL)"
                                block
                            >
                                =
                            </button>
                        </div>
                        <div cols="3">
                            <button
                                :disabled="combination.length === 0"
                                @click="combination.pop();"
                                block
                            >
                                <div>mdi-keyboard-backspace</div>
                            </button>
                        </div>
                        <div cols="12">
                            <div
                                label="Playlists"
                                solo
                                :items="$store.state.playlists"
                                item-text="name"
                                return-object
                                @change="combination.push(selectedPlaylist);clearPlaylistSelect()"
                                :disabled="!isTagSelectable()"
                            >
                            </div>
                        </div>
                        <div cols="12" class="pt-0">
                            <div class="text-h5 text-center">Preview Playlist</div>
                            <div class="pa-0 song-container">
                                <PreviewSongs :combination="combination"/>
                            </div>
                        </div>
                    </div>
                </div>
                <small>*indicates required field</small>
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
                <button
                    color="blue darken-1"
                    text
                    :disabled="!isOperatorSelectable()"
                    @click="saveEditPlaylistDialog"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService";
import {getDependencyStringFromList} from "@/utilities/Dependency";
import {Playlist} from "@/models/Playlist";
import {isAnOperator} from "@/models/Operator";
import PreviewSongs from "@/components/PreviewSongs";
import store from "@/store/store";

const {OPERATORS} = require('@/models/Operator');

export default {
    name: 'EditDynamicPlaylistDialog',
    components: {PreviewSongs},
    data: () => ({
        dialog: false,
        playlist: null,
        playlistName: "",
        combination: [],
        operator: OPERATORS,
        selectedPlaylist: null,
    }),
    methods: {
        async saveEditPlaylistDialog() {
            this.dialog = false
            await SpotifyService.editPlaylist(this.playlist.id, `[Dynamic] ${this.playlistName}`, getDependencyStringFromList(this.combination))
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your playlist is updated.",
                duration: 5000,
            })
            this.playlistName = ""
            this.combination = []
            await SpotifyService.fetchEverything()
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists());
        },
        clearPlaylistSelect() {
            this.$nextTick(() => {
                this.selectedPlaylist = 0
            })
        },
        getCombinationString() {
            let string = ""
            this.combination.forEach((combination) => {
                if (combination.name !== undefined) string += combination.name
                else string += combination
            })
            return string
        },
        getLastCombination() {
            return this.combination.length > 0 ? this.combination[this.combination.length - 1] : null
        },
        isTagSelectable() {
            if (this.combination.length === 0) return true
            if (this.combination.length >= 25) return false
            if (isAnOperator(this.getLastCombination())) return true
            return false
        },
        isOperatorSelectable() {
            if (this.combination.length === 0 || this.combination.length >= 25) return false
            if (Playlist.isInstance(this.getLastCombination())) return true
            return false
        },
    }
}
</script>

<style lang="scss" scoped>
.song-container {
    max-height: 250px;
    overflow-y: scroll;
    border: solid 1px darkgrey;
    border-radius: 5px;
}
</style>
