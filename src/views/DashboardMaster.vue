<template>
    <div class="flex flex-row">
        <div class="flex flex-col bg-nav p-4 pb-20 gap-4 w-14 md:w-48 fixed h-full">
            <div @click="$router.push({name:'Dashboard'})"
                 class="nav-item"
                 :class="$route.name === 'Dashboard' ? 'active' : ''">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-house"/>
                </div>
                <div class="hidden md:block">Dashboard</div>
            </div>
            <div @click="$router.push({name:'Dynamics'})"
                 class="nav-item"
                 :class="$route.name === 'Dynamics' ? 'active' : ''">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-bolt"/>
                </div>
                <div class="hidden md:block">Dynamics</div>
            </div>
            <div @click="$router.push({name:'Tagged'})"
                 class="nav-item"
                 :class="$route.name === 'Tagged' ? 'active' : ''">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-tag"/>
                </div>
                <div class="hidden md:block">Tagged</div>
            </div>
            <div @click="$router.push({name:'Untagged'})"
                 class="nav-item"
                 :class="$route.name === 'Untagged' ? 'active' : ''">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-bars-staggered"/>
                </div>
                <div class="hidden md:block">Untagged</div>
            </div>
            <div class="border-t w-full border-gray-600"/>
            <div @click="$router.push({name:'NewPlaylist'})"
                 class="nav-item"
                 :class="$route.name === 'NewPlaylist' ? 'active' : ''">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-plus"/>
                </div>
                <div class="hidden md:block">New Playlist</div>
            </div>
            <div @click="toggleEditorMode"
                 class="nav-item mt-auto">
                <div class="nav-item-icon">
                    <font-awesome-icon icon="fa-solid fa-pencil" :class="editorMode ? 'text-green' : ''"/>
                </div>
                <div class="hidden md:block" :class="editorMode ? 'text-green' : ''">Editor Mode</div>
            </div>
        </div>
        <div class="w-full pl-14 md:pl-48">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import store from "/src/store";
import Home from "/src/views/Home";

export default {
    name: 'DashboardMaster',
    data: () => ({}),
    async created() {
        if (!store.getters.isLoggedIn()) await this.$router.push(Home);
    },
    computed: {
        editorMode() {
            return store.state.editorMode
        }
    },
    methods: {
        toggleEditorMode() {
            store.commit('editorMode', !store.state.editorMode)
        }
    }
}
</script>

<style scoped lang="scss">
.nav-item {
    @apply flex gap-2 flex-nowrap items-center text-gray-400 hover:text-white cursor-pointer;

    &.active {
        @apply text-white;
    }

    .nav-item-icon {
        @apply w-6 h-6 text-center;
    }
}
</style>
