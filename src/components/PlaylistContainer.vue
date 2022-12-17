<template>
    <div class="flex flex-row flex-wrap gap-4">
        <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="w-64 bg-block p-4 rounded-md flex flex-col gap-2"
        >
            <img :src="playlist.img" :alt="playlist.name" />
            <div>
                {{ playlist.tag }}
                <div class="italic">Tracks count: {{ playlist.songs ? playlist.songs.length : 0 }}</div>
            </div>
            <div class="flex flex-row flex-wrap gap-1">
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