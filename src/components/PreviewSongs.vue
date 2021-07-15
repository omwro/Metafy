<template>
    <div>
        <SongCard
            v-for="(song, i) in getSongsFromDependencyLis(combination)"
            :key="i"
            :song="song"
            class="mb-1"
        />
    </div>
</template>

<script>
import {getSongsFromDependencyList} from "@/utilities/Dependency";
import SongCard from "@/components/SongCard";

export default {
    name: 'PreviewSongs',
    components: {SongCard},
    props: {
        combination: Array
    },
    data: () => ({}),
    methods: {
        getSongsFromDependencyLis(list) {
            return getSongsFromDependencyList(list)
        }
    }
}
</script>

<style lang="scss">
</style>
