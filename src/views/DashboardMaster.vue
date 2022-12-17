<template>
  <div class="pa-0">
    <v-navigation-drawer
        permanent
    >
      <v-list
          dense
          rounded
      >
        <v-list-item @click="$router.push({name:'Dashboard'})">
          <v-list-item-icon>
            <div>mdi-view-dashboard</div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Dynamics'})">
          <v-list-item-icon>
            <div>mdi-playlist-music</div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dynamics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Tagged'})">
          <v-list-item-icon>
            <div>mdi-playlist-music</div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tagged</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push({name:'Untagged'})">
          <v-list-item-icon>
            <div>mdi-playlist-music</div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Untagged</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div>
      <router-view></router-view>
    </div>
  </div>
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
