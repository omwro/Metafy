<template>
  <v-container class="pa-0">
    <v-navigation-drawer
        permanent
    >
      <v-list
          dense
          rounded
      >
        <v-list-item @click="$router.push({name:'Dashboard'})">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Dynamics'})">
          <v-list-item-icon>
            <v-icon>mdi-playlist-music</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dynamics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Tagged'})">
          <v-list-item-icon>
            <v-icon>mdi-playlist-music</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tagged</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Untagged'})">
          <v-list-item-icon>
            <v-icon>mdi-playlist-music</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Untagged</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-container>
</template>

<script>

export default {
  name: 'DashboardMaster',
  data: () => ({}),
  created() {
  },
  methods: {}
}
</script>

<style scoped lang="scss">

</style>
