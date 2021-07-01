<template>
    <v-dialog
        v-model="dialog"
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
                                v-model="playlistName"
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
                        <v-col cols="12" class="dialogChipContainer">
                            <v-chip
                                v-for="pl in $store.state.playlists"
                                :key="pl.id"
                                :disabled="!isTagSelectable()"
                                @click="combination.push(pl)"
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
                    @click="dialog = false"
                >
                    Close
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    :disabled="!isOperatorSelectable()"
                    @click="saveCreatePlaylistDialog"
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
const {OPERATORS} = require('@/models/Operator');


export default {
    name: 'CreateDynamicPlaylistDialog',
    data: () => ({
        dialog: false,
        playlistName: "",
        combination: [],
        operator: OPERATORS
    }),
    methods: {
        async saveCreatePlaylistDialog() {
            this.dialog = false
            await SpotifyService.createPlaylist(this.playlistName, getDependencyStringFromList(this.combination))
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
        getLastCombination() {
            return this.combination.length > 0 ? this.combination[this.combination.length - 1] : null
        },
        isTagSelectable() {
            if (this.combination.length === 0) return true
            if (isAnOperator(this.getLastCombination())) return true
            return false
        },
        isOperatorSelectable() {
            if (this.combination.length === 0) return false
            if (this.getLastCombination() instanceof Playlist) return true
            return false
        },
    }
}
</script>

<style lang="scss" scoped>
.playlist-chip {
    margin: 4px;
}
</style>
