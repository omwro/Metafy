<template>
    <div class="flex flex-row flex-wrap gap-4 justify-center">
        <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :id="playlist.id"
            :name="playlist.name"
            :img="playlist.img"
            :songsCount="playlist.songsCount"
            :subtags="playlist.subtags"/>
    </div>
</template>

<script>
import PlaylistCard from "./PlaylistCard";
export default {
    name: "PlaylistContainer",
    components: {PlaylistCard},
    props: ['playlists', 'liked'],
}
</script>

<style scoped>

</style>