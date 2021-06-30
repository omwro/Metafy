<template>
    <v-dialog
        v-model="dialog"
        max-width="600px"
        v-if="playlist"
    >
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                        <v-chip class="mr-2">{{ playlist.category }}</v-chip>
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
    </v-dialog>
</template>

<script>
import SongCard from "@/components/SongCard";
import {Playlist} from "@/models/Playlist";

export default {
    name: 'PlayListDetailDialog',
    components: {SongCard},
    data: () => ({
        dialog: false,
        playlist: undefined,
    }),
    methods: {
        isInstanceOfPlaylist(obj) {
            return obj instanceof Playlist
        }
    }
}
</script>

<style lang="scss">
</style>
