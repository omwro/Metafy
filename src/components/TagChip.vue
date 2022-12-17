<template>
    <v-chip
        class="playlist-chip pa-0"
        :label="isOperator"
    >
        <v-chip v-if="category" :style="getColor()">
            {{ category }}
        </v-chip>
        <template v-if="playlist">
            <v-chip v-if="playlist.tag">
                {{ playlist.tag }}
            </v-chip>
            <v-chip v-else-if="isOperator">
                {{ playlist }}
            </v-chip>
        </template>
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
            "#1E88E5",
            "#00ACC1",
            "#43A047",
            "#FB8C00",
            "#5E35B1",
            "#D81B60",
            "#6D4C41",
            "#546E7A",
            "#757575",
            "#B71C1C",
            "#0D47A1",
            "#006064",
            "#1B5E20",
            "#E65100",
            "#311B92",
            "#880E4F",
            "#3E2723",
            "#263238",
            "#212121",
        ]
    }),
    methods: {
        getColor() {
            if (this.category === DYNAMIC) {
                return "background: linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(29,185,84,0.9) 100%)"
            }
            const index = store.getters.getTaggedPlaylists().map((c) => c.category).indexOf(this.category)
            if (index >= 0) {
                return `background: ${this.colors[index % 20]}`
            }
        }
    }
}
</script>

<style scoped>

</style>