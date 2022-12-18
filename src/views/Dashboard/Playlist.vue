<template>
    <div>
        <h1 class="text-2xl">{{playlist.name}}</h1>
        <div class="flex flex-col">
            <SongCard
                v-for="song in playlist.songs"
                :key="song.id"
                :song="song"
            />
        </div>
    </div>
</template>

<script>
import store from "/src/store/store";
import SongCard from "../../components/SongCard";
export default {
    name: "Playlist",
    components: {SongCard},
    data: () => ({
        playlist: []
    }),
    created() {
        this.playlist = store.getters.getPlaylistFromId(this.$route.params.id)
    }
}
</script>

<style scoped>

</style>