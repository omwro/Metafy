<template>
  <section class="p-4">
      <h1 class="text-center text-2xl mb-4">Your untagged playlists</h1>
      <PlaylistContainer :playlists="$store.getters.getUntaggedPlaylists()" :liked="true"/>
  </section>
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