<template>
    <v-dialog
        v-model="dialog"
        max-width="600px"
        v-if="playlist"
    >
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit playlist {{playlist.name}}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="playlistName"
                                label="Playlist name *"
                                hint="The playlist name without the category. "
                                required
                            />
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <v-textarea
                                :value="getCombinationString()"
                                label="Playlist combination *"
                                auto-grow
                                rows="1"
                                row-height="15"
                                disabled
                            />
                        </v-col>
                        <v-col cols="12" class="py-0">
                            <small>Max 13 playlists</small>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.PLUS)"
                                block
                            >
                                +
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.MINUS)"
                                block
                            >
                                -
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                :disabled="!isOperatorSelectable()"
                                @click="combination.push(operator.EQUAL)"
                                block
                            >
                                =
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                :disabled="combination.length === 0"
                                @click="combination.pop();"
                                block
                            >
                                <v-icon>mdi-keyboard-backspace</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-autocomplete
                                label="Playlists"
                                solo
                                :items="$store.state.playlists"
                                item-text="name"
                                return-object
                                v-model="selectedPlaylist"
                                @change="combination.push(selectedPlaylist);clearPlaylistSelect()"
                                :disabled="!isTagSelectable()"
                            >
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <div class="text-h5 text-center">Preview Playlist</div>
                            <v-container class="px-0 song-container">
                                <PreviewSongs :combination="combination"/>
                            </v-container>
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
                    @click="dialog = false"
                >
                    Close
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    :disabled="!isOperatorSelectable()"
                    @click="saveEditPlaylistDialog"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
            this.notifySuccess("Your playlist is updated.")
            await SpotifyService.fetchEverything()
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists);
            this.playlistName = ""
            this.combination = []
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
            if (this.getLastCombination() instanceof Playlist) return true
            return false
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

<style lang="scss" scoped>
.playlist-chip {
    margin: 4px;
}

.song-container {
    max-height: 250px;
    overflow-y: scroll;
    border: solid 1px darkgrey;
    border-radius: 5px;
}
</style>
