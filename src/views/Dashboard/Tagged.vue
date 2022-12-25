<template>
  <section class="p-4">
      <h1 class="text-center text-2xl mb-4">Your tagged playlists</h1>
      <div v-for="taggedPlaylists in $store.getters.getTaggedPlaylists()"
           :key="taggedPlaylists.category"
            class="mb-8">
          <h2 class="text-center text-xl mb-4">{{ taggedPlaylists.category }}</h2>
          <PlaylistContainer :playlists="taggedPlaylists.playlists"/>
      </div>
  </section>
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