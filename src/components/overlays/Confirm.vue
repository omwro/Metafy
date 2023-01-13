<template>
    <div v-if="confirmAction"
        class="block h-full w-full fixed top-0 left-0 z-20 bg-black bg-opacity-70 flex justify-center items-center"
         @click="close">
        <div class="absolute bg-block border border-green w-80 m-auto" @click.stop>
            <div class="text-2xl p-4 pb-0">Confirm</div>
            <div class="p-4">{{confirmAction.message}}</div>
            <div class="flex flex-row">
                <div class="w-40 py-2 border border-green text-center cursor-pointer" @click="close">No</div>
                <div class="bg-green text-white border border-green w-40 py-2 text-center cursor-pointer"
                     @click="confirm">
                    Yes
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "/src/store";
import {SpotifyService} from "/src/spotify/spotifyService";

export default {
    name: "Confirm",
    computed: {
        confirmAction() {
            return store.state.confirmAction
        },
    },
    methods: {
        close() {
            store.commit('confirmAction', null)
        },
        async confirm() {
            if (this.confirmAction.action === 'REMOVE') {
                await SpotifyService.removeSongToPlaylist(this.confirmAction.song, this.confirmAction.playlist)
                this.$notify({
                    group: 'main',
                    type: 'success',
                    title: "Successfully removed.",
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