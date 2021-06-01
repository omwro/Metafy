<template>
    <v-container v-if="isLoggedIn()">
        <v-row>
            <v-col>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">
                    Your dynamic playlists
                    <v-icon v-on:click="refreshDynamicPlaylists">
                        mdi-refresh
                    </v-icon>
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container">
                <v-card v-for="pl in playlists.dynamics"
                        :key="pl.id">
                    <v-card-title>{{pl.metafy.tagName}}</v-card-title>
                    <v-card-text>
                            <v-chip
                                v-for="subPl in pl.metafy.subTags"
                                :key="subPl.id"
                                class="playlist-chip"
                            >
                                {{subPl.metafy.tagName}}
                            </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">Your tagged playlists</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                v-for="plwt in playlists.tags"
                :key="plwt.categoryName"
            >
                <v-row>
                    <v-col>
                        <h3 class="text-center">{{ plwt.categoryName }}</h3>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col

                        class="playlist-container"
                    >
                        <v-chip
                            v-for="pl in plwt.playlists"
                            :key="pl.id"
                            class="playlist-chip"
                        >
                            {{ pl.metafy.tagName }}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h2 class="text-center">Your untagged playlists</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container">
                <v-chip
                    v-for="pl in playlists.others"
                    :key="pl.id"
                    class="playlist-chip"
                >
                    {{ pl.name }}
                </v-chip>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import {SpotifyService} from "@/spotify/spotifyService.js";
import store from "@/store/store";

export default {
    name: 'Home',
    data: () => ({
        playlists: [],
        key: 0
    }),
    created() {
        this.fetchPlaylists()
    },
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        async fetchPlaylists() {
            SpotifyService.fetchPlaylists().then((result) => {
                console.log("FetchUserPlaylists", result);
                this.playlists = SpotifyService.convertPlaylist(result);
                console.log("Converted Playlist", this.playlists)
            });
        },
        async refreshDynamicPlaylists() {
            await SpotifyService.refreshDynamics(this.playlists.dynamics);
            await this.fetchPlaylists();
        }
    }
}
</script>

<style scoped lang="scss">
.playlist-container {
    margin: 0 12px;
    padding: 8px;
    border: solid 1px black;

    .playlist-chip {
        margin: 4px;
    }
}
</style>
