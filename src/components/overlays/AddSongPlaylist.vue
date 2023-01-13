<template>
    <div v-if="songAction"
         class="block h-full w-full fixed top-0 left-0 z-20 bg-black bg-opacity-70 flex justify-center items-center"
         @click="close">
        <div class="absolute bg-block border border-green w-80 md:w-auto m-auto" @click.stop>
            <div class="text-2xl p-4 pb-0">Add song to playlist</div>
            <div class="p-4 pb-0">Select a playlist to add the song '{{songAction.song.name}}' to.</div>
            <div class="flex flex-col gap-2 p-4">
                <label for="filter">Filter playlists</label>
                <input type="text"
                       name="filter"
                       id="filter"
                       v-model="filter"
                       placeholder="release radar"
                       class="block w-auto rounded-md text-black focus:border-green focus:ring-green"
                >
                <div class="h-96 overflow-y-auto bg-block">
                    <PlaylistCard v-for="playlist in playlists"
                                  :key=playlist.id
                                  :playlist="playlist"
                                  :force-mobile-view="true"
                                  @click="confirm(playlist)"/>
                </div>
            </div>
            <div class="flex flex-row">
                <div class="w-full py-2 border border-green text-center cursor-pointer" @click="close">Cancel</div>
            </div>

        </div>
    </div>
</template>

<script>
import store from "/src/store";
import PlaylistCard from "/src/components/PlaylistCard";
import {SpotifyService} from "/src/spotify/spotifyService";

export default {
    name: "AddSongPlaylist",
    components: {PlaylistCard},
    data: () => ({
        filter: ""
    }),
    computed: {
        playlists() {
            return store.state.playlists;
        },
        songAction() {
            return store.state.songAction
        },
    },
    methods: {
        close() {
            store.commit('songAction', null)
        },
        async confirm(playlist) {
            if (this.songAction.action === 'ADD') {
                await SpotifyService.addSongToPlaylist(this.songAction.song, playlist)
                this.$notify({
                    group: 'main',
                    type: 'success',
                    title: "Successfully added.",
                    duration: 5000,
                })
                this.close();
            }
        }
    }
}
</script>

<style scoped>

</style>