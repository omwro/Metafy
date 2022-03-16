<template>
    <v-card class="song-card">
        <v-row class="ma-0 mb-2 pa-1">
            <v-col>
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
                <template v-if="tagged">
                    <v-row class="pt-2" :key="key">
                        <v-col v-for="(t, i) in $store.getters.getTaggedTracksById(song.id)"
                               :key="i"
                               cols="auto"
                               class="pa-1"
                        >
                            <tag-chip :category="t.category" :playlist="{tag: t.tag}"/>
                        </v-col>
                        <v-col class="pa-1" cols="auto">
                            <v-autocomplete :items="$store.getters.getSelectTags"
                                      item-text="text"
                                      item-value="value"
                                      @change="onTagSelect"
                                      solo/>
                        </v-col>
                    </v-row>
                </template>
            </v-col>
            <v-col cols="auto">
                <v-col class="pa-1">
                    <v-icon
                        small
                        style="margin-bottom: auto"
                        @click="redirect"
                    >
                        mdi-spotify
                    </v-icon>
                </v-col>
                <v-col class="pa-1" v-if="song.preview_url">
                    <v-icon
                        small
                        style="margin-bottom: auto"
                        @click="play"
                    >
                        mdi-play
                    </v-icon>
                </v-col>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import {Song} from "@/models/Song";
import Vue from "vue";
import TagChip from "./TagChip";
import {SpotifyService} from "@/spotify/spotifyService";

export default {
    name: 'SongCard',
    components: {TagChip},
    props: {
        song: [Song, Object],
        tagged: {
            type: Boolean,
            required: false
        }
    },
    data: () => ({
        key: 0
    }),
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
        },
        redirect() {
            window.open(this.song.externalUrl)
        },
        play() {
            if (Vue.prototype.$audio.currentTime === 0) {
                Vue.prototype.$audio = new Audio(this.song.preview_url)
                Vue.prototype.$audio.play()
            } else {
                Vue.prototype.$audio.pause()
                Vue.prototype.$audio.currentTime = 0
            }
        },
        async onTagSelect(tag) {
            await SpotifyService.addSongToPlaylist(this.song, tag)
            this.key++
            this.$notify({
                group: 'main',
                type: 'success',
                title: `${tag.category} - ${tag.tag} is added to ${this.song.name}`,
                duration: 5000,
            })
        }
    }
}
</script>

<style lang="scss">
.song-card {
    background-color: #333333 !important;
}
</style>
