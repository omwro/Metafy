<template>
    <div class="flex flex-row flex-wrap gap-4 justify-center">
        <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            @click="$router.push({name: 'Playlist', params: {id: playlist.id}})"/>
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