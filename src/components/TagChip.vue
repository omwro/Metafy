<template>
    <v-chip
        class="playlist-chip pa-0"
        :label="isOperator"
    >
        <v-chip v-if="category" :style="getColor()">
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
import store, {DYNAMIC} from "@/store/store";

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
    data: () => ({
        colors: [
            "#E53935",
            "#039BE5",
            "#43A047",
            "#FB8C00",
            "#3949AB",
            "#00897B",
            "#FDD835",
            "#8E24AA",
            "#6D4C41",
            "#546E7A"
        ]
    }),
    methods: {
        getColor() {
            if (this.category === DYNAMIC) {
                return "background: linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(29,185,84,0.9) 100%)"
            }
            if (Playlist.isInstance(this.playlist)) {
                const index = store.getters.getTaggedPlaylists.map((c) => c.category).indexOf(this.category)
                return `background: ${this.colors[index.toString().split('').pop()]}`
            }
        }
    }
}
</script>

<style scoped>

</style>