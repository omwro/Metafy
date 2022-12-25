<template>
    <div
        class="playlist-card w-full bg-block p-4 rounded flex flex-col gap-3 cursor-pointer hover:bg-light"
        :class="forceMobileView ? 'mobile-view' : ''"
        @click="$emit('click')"
    >
        <div class="playlist-card-top flex flex-row gap-4">
            <img :src="image" :alt="playlist.name" class="h-24 w-24 bg-light"/>
            <div class="flex flex-col gap-3">
                <div class="text-lg">{{ playlist.name }}</div>
                <div class="italic text-sm">Tracks count: {{ playlist.songsCount }}</div>
            </div>
        </div>
        <div v-if="playlist.subtags && playlist.subtags.length" class="flex flex-row flex-wrap gap-1">
            <TagChip
                v-for="subPlaylist in subPlaylists"
                :key="subPlaylist.id"
                :playlist="subPlaylist"
                :category="subPlaylist.category"
            />
        </div>
    </div>
</template>

<script>
import TagChip from "./TagChip";
import store from "/src/store";
export default {
    name: "PlaylistCard",
    components: {TagChip},
    props: ["playlist", "forceMobileView"],
    computed: {
        subPlaylists() {
            return this.playlist.subtags.map(playlistId => store.state.playlists[playlistId])
        },
        image() {
            return this.playlist.img ? this.playlist.img : require("@/assets/placeholder.png")
        }
    }
}
</script>

<style scoped lang="scss">
.playlist-card:not(.mobile-view) {
    &.playlist-card {
        @apply md:w-64
    }

    .playlist-card-top {
        @apply md:flex-col md:gap-0;

        > img {
            @apply md:h-56 md:w-56
        }

        > div {
            @apply md:self-auto md:gap-2 md:pt-2
        }
    }

}
</style>