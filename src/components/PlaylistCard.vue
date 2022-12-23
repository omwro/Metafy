<template>
    <div
        class="w-full md:w-64 bg-block p-4 rounded flex flex-col gap-3 cursor-pointer hover:bg-light"
        @click="$router.push({name: 'Playlist', params: {id: id}})"
    >
        <div class="flex flex-row md:flex-col gap-4 md:gap-0">
            <img :src="img ? img : require('@/assets/placeholder.png')" :alt="name" class="h-24 w-24 md:h-56 md:w-56 bg-light"/>
            <div class="flex flex-col md:self-auto gap-3 md:gap-2 md:pt-2">
                <div class="text-lg">{{ name }}</div>
                <div class="italic text-sm">Tracks count: {{ songs ? songs.length : 0 }}</div>

            </div>
        </div>
        <div v-if="subtags && subtags.length" class="flex flex-row flex-wrap gap-1">
            <TagChip
                v-for="subPlaylist in subtags"
                :key="subPlaylist.id"
                :playlist="subPlaylist"
                :category="subPlaylist.category"
            />
        </div>
    </div>
</template>

<script>
import TagChip from "./TagChip";
export default {
    name: "PlaylistCard",
    components: {TagChip},
    props: ["id", "name", "img", "songs", "subtags"]
}
</script>

<style scoped>

</style>