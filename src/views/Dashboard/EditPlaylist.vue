<template>
    <section class="p-4 flex flex-col gap-4 items-center mx-auto max-w-screen-sm 2xl:max-w-screen-xl">
        <h1 class="text-center text-2xl">Edit Dynamic Playlist</h1>
        <div class="flex flex-col gap-8 w-full 2xl:flex-row">
            <div class="flex flex-col w-full gap-8 max-w-screen-sm">
                <div class="flex flex-col gap-2">
                    <label for="name">Playlist Name</label>
                    <input type="text"
                           name="name"
                           id="name"
                           v-model="name"
                           placeholder="Driving"
                           class="block w-auto rounded-md text-black focus:border-green focus:ring-green">
                    <div class="text-xs text-gray-300 italic">[{{dynamic}}] {{name}}</div>
                </div>
                <div class="flex flex-col w-full gap-2">
                    <label for="combination">Combination</label>
                    <div class="flex flex-row gap-2 w-full">
                        <input type="text"
                               name="combination"
                               id="combination"
                               :value="combinationString"
                               disabled
                               class="bg-gray-500 w-full w-auto rounded">
                        <button type="button" class="bg-green py-2 px-3 rounded" @click="combination.pop()">
                            <font-awesome-icon icon="fa-solid fa-arrow-left" />
                        </button>
                    </div>
                    <div class="text-xs text-gray-300">Max 13 playlist combinations</div>
                </div>
                <div class="flex flex-col w-full gap-8">
                    <div class="flex flex-row gap-4">
                        <button type="button"
                                class="py-2 w-full rounded"
                                :class="disableOperator ? 'bg-gray-500' : 'bg-green'"
                                @click="combination.push('+'); filter = ''"
                                :disabled="disableOperator">
                            <font-awesome-icon icon="fa-solid fa-plus" />
                        </button>
                        <button type="button"
                                class="py-2 w-full rounded"
                                :class="disableOperator ? 'bg-gray-500' : 'bg-green'"
                                @click="combination.push('-'); filter = ''"
                                :disabled="disableOperator">
                            <font-awesome-icon icon="fa-solid fa-minus" />
                        </button>
                        <button type="button"
                                class="py-2 w-full rounded"
                                :class="disableOperator ? 'bg-gray-500' : 'bg-green'"
                                @click="combination.push('='); filter = ''"
                                :disabled="disableOperator">
                            <font-awesome-icon icon="fa-solid fa-equals" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="filter">Filter playlists</label>
                        <input type="text"
                               name="filter"
                               id="filter"
                               v-model="filter"
                               placeholder="release radar"
                               class="block w-auto rounded-md text-black focus:border-green focus:ring-green"
                               :class="disableOperator ? '' : 'bg-gray-500'"
                               :disabled="!disableOperator">
                        <div class="h-96 overflow-y-auto bg-block">
                            <PlaylistCard v-for="playlist in playlists"
                                          :key=playlist.id
                                          :playlist="playlist"
                                          :force-mobile-view="true"
                                          @click="combination.push(playlist.id)"/>
                        </div>
                    </div>
                </div>
                <button type="submit"
                        class="rounded w-full py-4"
                        :class="allowCreatePlaylist ? 'bg-green' : 'bg-gray-500'"
                        :disabled="!allowCreatePlaylist" @click="createPlaylist">
                    Edit playlist
                </button>
            </div>
            <div class="flex flex-col w-full gap-2 max-w-screen-sm" style="max-height: 900px">
                <div class="text-center">Preview Songs</div>
                <div class="h-64 overflow-y-auto bg-block 2xl:h-full">
                    <SongCard v-for="(song, index) in previewSongs"
                              :key="song.id"
                              :index="index"
                              :song="song" />
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import store, {DYNAMIC} from "/src/store";
import {
    getDependencyNamesFromList,
    getDependencyStringFromList,
    getSongsFromDependencyList
} from "/src/utilities/Dependency";
import PlaylistCard from "/src/components/PlaylistCard";
import {SpotifyService} from "/src/spotify/spotifyService";
import SongCard from "/src/components/SongCard";

export default {
    name: "EditPlaylist",
    components: {SongCard, PlaylistCard},
    data: () => ({
        dynamic: DYNAMIC,
        name: "",
        filter: "",
        combination: []
    }),
    created() {
        const id = this.$route.params.id;
        const playlist = store.state.playlists[id]
        this.name = playlist.tag
        this.combination = playlist.dependency
    },
    methods: {
        async createPlaylist() {
            store.commit("loading", true);
            const editedPlaylist = await SpotifyService.editPlaylist(
                this.$route.params.id,
                `[${this.dynamic}] ${this.name}`,
                getDependencyStringFromList(this.combination)
            )
            await SpotifyService.fetchEverything()
            await SpotifyService.refreshDynamicPlaylistSongs(store.getters.getDynamicPlaylists());
            store.commit("loading", false);
            await this.$router.push({name: 'Playlist', params: {id: editedPlaylist.id}})
            this.$notify({
                group: 'main',
                type: 'success',
                title: "Your playlist is edited.",
                duration: 5000,
            })
        }
    },
    computed: {
        combinationString() {
            return getDependencyNamesFromList(this.combination)
        },
        playlists() {
            if (this.disableOperator) return Object.values(store.state.playlists)
                .filter(playlist => playlist.name.toLowerCase().includes(this.filter.toLowerCase()))
            return []

        },
        allowCreatePlaylist() {
            return this.combination.length >= 1 &&
                this.combination.length <= 25 &&
                this.combination.length % 2 === 1 &&
                this.name !== ""
        },
        disableOperator() {
            return this.combination.length % 2 === 0
        },
        previewSongs() {
            return getSongsFromDependencyList(this.combination)
        }
    }
}
</script>

<style scoped lang="scss">

</style>