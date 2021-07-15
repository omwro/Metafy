<template>
    <v-card class="song-card">
        <v-card-title class="pa-2">
            {{ song.name }}
        </v-card-title>
        <v-card-text class="pa-0">
            <v-row class="ma-0">
                <v-col cols="12" class="px-2 py-1">
                    {{ getArtistsString() }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import {Song} from "@/models/Song";

export default {
    name: 'SongCard',
    props: {
        song: [Song, Object]
    },
    data: () => ({}),
    methods: {
        getArtistsString() {
            let string = ""
            this.song.artists.forEach((artist) => {
                if (string !== "") {
                    string += ", "
                }
                string += artist.name
            })
            return string
        }
    }
}
</script>

<style lang="scss">
.song-card {
    background-color: #333333 !important;
}
</style>
