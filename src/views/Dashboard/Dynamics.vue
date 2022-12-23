<template>
  <section class="p-4">
      <h1 class="text-center text-2xl mb-4">Your dynamic playlists</h1>
      <PlaylistContainer :playlists="$store.getters.getDynamicPlaylists()"/>
  </section>
</template>

<script>
import PlaylistContainer from "/src/components/PlaylistContainer";
export default {
  name: "Dynamics",
    components: {PlaylistContainer}
}
</script>

<style scoped lang="scss">

</style>