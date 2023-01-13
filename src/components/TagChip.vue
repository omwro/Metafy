<template>
    <div class="border rounded-2xl overflow-hidden border-green flex flex-row w-min">
        <div v-if="category" class="bg-green rounded-2xl whitespace-nowrap px-2 pb-0.5"
             :class="editable ? 'text-md' : 'text-xs'">
            {{ category }}
        </div>
        <div v-if="playlist" class="whitespace-nowrap px-2 pb-0.5"  :class="editable ? 'text-md' : 'text-xs'">
            <template v-if="playlist.tag">
                {{ playlist.tag }}
            </template>
            <template v-else-if="isOperator">
                {{ playlist }}
            </template>
        </div>
        <div v-if="removable"
             class="text-red px-2 cursor-pointer border-l border-green hover:bg-red hover:text-white"
             :class="editable ? 'text-md' : 'text-xs'"
             @click="$emit('click-remove')">
            <font-awesome-icon icon="fa-solid fa-minus"/>
        </div>
        <div v-if="creatable"
             class="text-green px-2 cursor-pointer border-l border-green hover:bg-green hover:text-white"
             :class="editable ? 'text-md' : 'text-xs'"
             @click="$emit('click-add')">
            <font-awesome-icon icon="fa-solid fa-plus"/>
        </div>
    </div>
</template>

<script>
import {Playlist} from "/src/models/Playlist";
import store from "/src/store";

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
        },
        removable: {
            type: Boolean,
            default: false
        },
        creatable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        editable() {
            return store.state.editorMode
        }
    }
}
</script>

<style scoped>
.border-l {
    border-left-width: 1px;
}
</style>