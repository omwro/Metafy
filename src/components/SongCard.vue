<template>
    <div class="flex flex-col gap-2 p-2 rounded hover:bg-block">
        <div class="flex flex-row gap-4">
            <div class="self-center w-6 text-center text-gray-300">{{ index + 1 }}</div>
            <img :src="song.img" :alt="song.name" class="h-16 w-16">
            <div class="flex flex-col self-center">
                <div class="text-lg">{{ song.name }}</div>
                <div class="text-md text-gray-300">{{ getArtistsString() }}</div>
            </div>
        </div>
        <div v-if="song.playlists" :key="key" class="flex flex-row flex-wrap gap-2">
            <TagChip v-for="(playlist, i) in songPlaylists"
                     :key="i"
                     :category="playlist.category"
                     :playlist="{tag: playlist.tag}"/>
        </div>
    </div>
</template>

<script>
import {Song} from "/src/models/Song";
import Vue from "vue";
import TagChip from "./TagChip";
import {SpotifyService} from "/src/spotify/spotifyService";
import store from "/src/store";

export default {
    name: 'SongCard',
    components: {TagChip},
    props: {
        song: [Song, Object],
        index: Number
    },
    data: () => ({
        key: 0
    }),
    computed: {
        songPlaylists() {
            return this.song.playlists
                .map(playlistId => store.state.playlists[playlistId]);
        }
    },
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
