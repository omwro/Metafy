<template>
  <div>
      <h2 class="text-center">Your dynamic playlists</h2>
      <PlaylistContainer :playlists="$store.getters.getDynamicPlaylists()"/>
  </div>
</template>

<script>
import PlaylistContainer from "/src/components/PlaylistContainer";
export default {
  name: "Dynamics",
    components: {PlaylistContainer}
}
</script>

<style scoped>

</style>