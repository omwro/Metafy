<template>
    <div class="flex flex-row flex-wrap gap-4">
        <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="w-64 bg-block p-4 rounded-md flex flex-col gap-2 cursor-pointer	"
            @click="$router.push({name: 'Playlist', params: {id: playlist.id}})"
        >
            <img :src="playlist.img" :alt="playlist.name" />
            <div class="text-lg">{{ playlist.tag }}</div>
            <div class="italic text-sm">Tracks count: {{ playlist.songs ? playlist.songs.length : 0 }}</div>
            <div v-if="playlist.subtags" class="flex flex-row flex-wrap gap-1">
                <TagChip
                    v-for="subPlaylist in playlist.subtags"
                    :key="subPlaylist.id"
                    :playlist="subPlaylist"
                    :category="subPlaylist.category"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TagChip from "./TagChip";
export default {
    name: "PlaylistContainer",
    components: {TagChip},
    props: ['playlists']
}
</script>

<style scoped>

</style>