<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <img :src="song.img">
            <div class="flex flex-col">
                <span class="text-lg">{{ song.name }}</span>
                <span class="text-sm text-gray-300">{{ getArtistsString() }}</span>
            </div>
        </div>
        <div v-if="$store.getters.getTaggedTracksById(song.id)">
            <div :key="key">
                <div v-for="(t, i) in $store.getters.getTaggedTracksById(song.id)"
                     :key="i"
                >
                    <TagChip :category="t.category" :playlist="{tag: t.tag}"/>
                </div>
            </div>
        </div>

<!--        <div class="ma-0 mb-2 pa-1">-->
<!--            <div>-->
<!--                <div class="pa-2">-->
<!--                    {{ song.name }}-->
<!--                </div>-->
<!--                <div class="pa-0">-->
<!--                    <div class="ma-0">-->
<!--                        <div cols="12" class="px-2 py-1">-->
<!--                            {{ getArtistsString() }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <template v-if="tagged">-->
<!--                    <div class="pt-2" :key="key">-->
<!--                        <div v-for="(t, i) in $store.getters.getTaggedTracksById(song.id)"-->
<!--                               :key="i"-->
<!--                               cols="auto"-->
<!--                               class="pa-1"-->
<!--                        >-->
<!--                            <tag-chip :category="t.category" :playlist="{tag: t.tag}"/>-->
<!--                        </div>-->
<!--                        <div class="pa-1" cols="auto">-->
<!--                            <div :items="$store.getters.getSelectTags()"-->
<!--                                      item-text="text"-->
<!--                                      item-value="value"-->
<!--                                      @change="onTagSelect"-->
<!--                                      solo/>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </div>-->
<!--            <div cols="auto">-->
<!--                <div class="pa-1">-->
<!--                    <div-->
<!--                        small-->
<!--                        style="margin-bottom: auto"-->
<!--                        @click="redirect"-->
<!--                    >-->
<!--                        mdi-spotify-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="pa-1" v-if="song.preview_url">-->
<!--                    <div-->
<!--                        small-->
<!--                        style="margin-bottom: auto"-->
<!--                        @click="play"-->
<!--                    >-->
<!--                        mdi-play-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
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
</style>
