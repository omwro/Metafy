<template>
    <section class="p-4">
        <h1 class="text-center text-2xl mb-4">{{playlist.name}}</h1>
        <div v-if="playlist.songs && playlist.songs.length" class="flex flex-col">
            <SongCard
                v-for="(song, index) in playlist.songs"
                :key="song.id"
                :song="song"
                :index="index"
            />
        </div>
        <div v-else>
            <h2 class="text-xl text-center pt-8">No songs inside this playlist</h2>
        </div>
    </section>
</template>

<script>
import store from "/src/store/store";
import SongCard from "../../components/SongCard";
export default {
    name: "Playlist",
    components: {SongCard},
    data: () => ({
        playlist: {}
    }),
    created() {
        if (this.$route.params.id === "liked") {
            this.playlist = {
                id: 0,
                name: "Liked Songs",
                songs: store.state.likedTracks
            }
        } else {
            this.playlist = store.getters.getPlaylistFromId(this.$route.params.id)
        }
    }
}
</script>

<style scoped>

</style>