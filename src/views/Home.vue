<template>
    <div>
        <h1>Welcome to Metafy!</h1>
    </div>
</template>

<script>
import store from "/src/store";
import Dashboard from "./Dashboard/Dashboard";

export default {
    name: 'Home',
    async created() {
        if (store.getters.isLoggedIn()) await this.$router.push(Dashboard);
    }
}
</script>

<style lang="scss">

</style>
