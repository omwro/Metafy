<template>
    <div class="flex flex-row">
        <div class="w-24 bg-nav">
            <div @click="$router.push({name:'Dashboard'})">
                <div>mdi-view-dashboard</div>
                <div>Dashboard</div>
            </div>
            <div @click="$router.push({name:'Dynamics'})">
                <div>mdi-playlist-music</div>
                <div>Dynamics</div>
            </div>
            <div @click="$router.push({name:'Tagged'})">
                <div>mdi-playlist-music</div>
                <div>Tagged</div>
            </div>
            <div @click="$router.push({name:'Untagged'})">
                <div>mdi-playlist-music</div>
                <div>Untagged</div>
            </div>
        </div>
        <div class="w-full">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import store from "../store/store";
import Home from "/src/views/Home";

export default {
    name: 'DashboardMaster',
    data: () => ({}),
    async created() {
        if (!store.getters.isLoggedIn()) await this.$router.push(Home);
    }
}
</script>

<style scoped lang="scss">

</style>
