<template>
  <div>
      <h2 class="text-center">Your untagged playlists</h2>
      <PlaylistContainer :playlists="$store.getters.getUntaggedPlaylists()"/>
  </div>
</template>

<script>
import PlaylistContainer from "../../components/PlaylistContainer";
export default {
  name: "Untagged",
    components: {PlaylistContainer}
}
</script>

<style scoped>

</style>