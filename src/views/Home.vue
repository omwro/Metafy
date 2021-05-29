<template>
    <v-container v-if="isLoggedIn()">
        <v-row>
            <v-col>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3 class="text-center">Your tagged playlists</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-row>
                    <v-col
                        v-for="obj in playlistsWithTags"
                        :key="obj.tag"
                        class="playlist-container"
                    >
                        <h3 class="text-center">{{ obj.tag }}</h3>
                        <v-chip
                            v-for="pl in obj.playlists"
                            :key="pl.id"
                            class="playlist-chip"
                        >
                            {{ pl.name }}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <h3 class="text-center">Your untagged playlists</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container">
                <v-chip
                    v-for="pl in playlistsWithoutTags"
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
import {SpotifyService} from "@/services/spotifyService.js";
import store from "@/store/store";

export default {
    name: 'Home',
    data: () => ({
        key: 0,
        playlistsWithTags: [],
        playlistsWithoutTags: []
    }),
    created() {
        SpotifyService.fetchPlaylists().then((result) => {
            const splittedPlaylists = SpotifyService.splitPlaylistFromTags(result);
            this.playlistsWithTags = splittedPlaylists.withTags;
            this.playlistsWithoutTags = splittedPlaylists.withoutTags;
        });
    },
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        }
    }
}
</script>

<style scoped lang="scss">
.playlist-container {
    margin: 0 32px;
    padding: 8px;
    border: solid 1px black;

    .playlist-chip {
        margin: 4px;
    }
}
</style>
