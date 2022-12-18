<template>
  <div>
      <h2 class="text-center">Your tagged playlists</h2>
      <div v-for="taggedPlaylists in $store.getters.getTaggedPlaylists()" :key="taggedPlaylists.category">
          <h3 class="text-center">{{ taggedPlaylists.category }}</h3>
          <PlaylistContainer :playlists="taggedPlaylists.playlists"/>
      </div>
  </div>
</template>

<script>
import PlaylistContainer from "../../components/PlaylistContainer";
export default {
  name: "Tagged",
    components: {PlaylistContainer}
}
</script>

<style scoped>

</style>