<template>
    <div class="flex flex-row flex-wrap gap-4 justify-center">
        <template v-if="liked">
            <PlaylistCard id="liked"
                          name="Liked Songs"
                          img="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                          :songs="likedSongs" />
        </template>
        <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :id="playlist.id"
            :name="playlist.name"
            :img="playlist.img"
            :songs="likedSongs"
            :subtags="playlist.subtags"/>
    </div>
</template>

<script>
import store from "/src/store/store";
import PlaylistCard from "./PlaylistCard";
export default {
    name: "PlaylistContainer",
    components: {PlaylistCard},
    props: ['playlists', 'liked'],
    computed: {
        likedSongs() {
            return store.state.likedTracks
        }
    }
}
</script>

<style scoped>

</style>