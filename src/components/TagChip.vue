<template>
    <v-chip
        class="playlist-chip pa-0"
        :label="isOperator"
    >
        <v-chip v-if="category" color="red">
            {{ category }}
        </v-chip>
        <v-chip v-if="playlist">
            <template v-if="!isOperator">
                {{ playlist.tag }}
            </template>
            <template v-else>
                {{ playlist }}
            </template>
        </v-chip>
    </v-chip>
</template>

<script>
import {Playlist} from "@/models/Playlist";

export default {
    name: "TagChip",
    props: {
        playlist: {
            type: [Playlist, Object, String],
        },
        category: {
            type: String
        },
        isOperator: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style scoped>

</style>