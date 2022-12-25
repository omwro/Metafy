<template>
    <section class="p-4">
        <h1 class="text-center text-2xl mb-4">
            {{ playlist.name }}
            <font-awesome-icon v-if="playlist.category === dynamic" icon="fa-solid fa-pencil"
                               class="h-4 w-4 p-1 bg-green rounded cursor-pointer"
                               @click="$router.push({name: 'EditPlaylist', params: {id: playlist.id}})"/>
        </h1>
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
import store, {DYNAMIC} from "/src/store/store";
import SongCard from "/src/components/SongCard";

export default {
    name: "Playlist",
    components: {SongCard},
    data: () => ({
        playlist: {},
        dynamic: DYNAMIC
    }),
    created() {
        const id = this.$route.params.id;
        const playlist = store.state.playlists[id]
        const songs = playlist.songs.map(songId => store.state.songs[songId])
        this.playlist = {
            id,
            name: playlist.name,
            category: playlist.category,
            songs
        }
    }
}
</script>

<style scoped>

</style>