<template>
    <section class="py-4 md:p-4">
        <h1 class="text-center text-2xl mb-4">
            {{ playlist.name }}
            <font-awesome-icon v-if="playlist.category === dynamic" icon="fa-solid fa-pencil"
                               class="h-4 w-4 p-1 bg-green rounded cursor-pointer"
                               @click="$router.push({name: 'EditPlaylist', params: {id: playlist.id}})"/>
        </h1>
        <div v-if="songs && songs.length" class="flex flex-col">
            <SongCard
                v-for="(song, index) in songs"
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
import store, {DYNAMIC} from "/src/store";
import SongCard from "/src/components/SongCard";

export default {
    name: "Playlist",
    components: {SongCard},
    data: () => ({
        playlistId: null,
        dynamic: DYNAMIC
    }),
    created() {
        this.playlistId = this.$route.params.id;
    },
    computed: {
        playlist() {
            return store.state.playlists[this.playlistId]
        },
        songs() {
            return this.playlist.songs.map(songId => store.state.songs[songId])
        }
    }
}
</script>

<style scoped>

</style>