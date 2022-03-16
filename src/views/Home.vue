<template>
    <v-container v-if="isLoggedIn()">
        <v-row>
            <v-col>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </v-col>
        </v-row>
        <v-row justify="center" class="mx-0">
            <v-col cols="auto" class="playlist-container dark-background">
                <QuickTools/>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 class="text-center">
                    Your dynamic playlists
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container dark-background pa-0">
                <v-card
                    v-for="pl in $store.getters.getDynamicPlaylists"
                    :key="pl.id"
                    @click="showPlaylistDetailDialog(pl)"
                    class="dynamic-card"
                >
                    <v-card-title>
                        {{ pl.tag }}
                        <v-chip outlined class="ml-1 small-chip">
                            {{ pl.songs.length }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <TagChip
                            v-for="subpl in pl.subtags"
                            :key="subpl.id"
                            :playlist="subpl"
                            :category="subpl.category"
                        />
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
            <v-col class="playlist-container dark-background">
                <template v-for="tpl in $store.getters.getTaggedPlaylists">
                    <TagChip
                        v-for="pl in tpl.playlists"
                        :key="pl.id"
                        :playlist="pl"
                        :category="pl.category"
                        @click.native="showPlaylistDetailDialog(pl)"
                    />
                </template>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 class="text-center">Your untagged playlists</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container dark-background">
                <TagChip
                    v-for="pl in $store.getters.getUntaggedPlaylists"
                    :key="pl.id"
                    :playlist="pl"
                    @click.native="showPlaylistDetailDialog(pl)"
                />
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <h2 class="text-center">Your Liked Songs</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="playlist-container dark-background max-height">
                <SongCard
                    v-for="lt in $store.state.likedTracks"
                    :key="lt.id"
                    :song="lt"
                    tagged
                />
            </v-col>
        </v-row>

        <PlayListDetailDialog ref="playlistDetailDialog" />

    </v-container>
    <v-container v-else>
        <h1>Welcome to Metafy!</h1>
    </v-container>
</template>

<script>
import store from "@/store/store";
import {Playlist} from "@/models/Playlist";
import PlayListDetailDialog from "@/components/PlaylistDetailDialog";
import QuickTools from "@/components/QuickTools";
import TagChip from "@/components/TagChip";
import SongCard from "../components/SongCard";

export default {
    name: 'Home',
    components: {SongCard, TagChip, QuickTools, PlayListDetailDialog},
    data: () => ({
        createPlaylistDialog: false,
        createPlaylistDialogName: "",
        dialogTagToggle: true,
        dialogOperatorToggle: false,
        combination: [],
        selectedPlaylist: undefined,
    }),
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn;
        },
        isInstanceOfPlaylist(obj) {
            return Playlist.isInstance(obj)
        },
        showPlaylistDetailDialog(playlist) {
            this.$refs.playlistDetailDialog.playlist = playlist
            this.$refs.playlistDetailDialog.dialog = true
        },
    }
}
</script>

<style lang="scss">
.playlist-container {
    margin: 0 12px 12px;
    padding: 8px;
    border: solid 1px white;
    border-radius: 5px;

    .playlist-container-title {
        width: 100px;
        margin-top: -10px;
        text-align: center;
        border-radius: 25px;
        border: solid 1px white;
    }

    .dynamic-card:not(:last-child) {
        border-bottom: dashed 1px white !important;
    }

    .small-chip {
        height: 20px;
        font-size: 12px;
        padding: 0 6px;
        margin-bottom: auto;
        border-color: white;
    }
}

.playlist-chip {
    margin: 4px;

    &:hover{
        .v-chip::before {
            opacity: 0.08;
        }
    }
}

.dialogChipContainer {
    max-height: 150px;
    overflow-y: scroll;
}

.max-height {
    height: calc(100vh - 100px);
    overflow-y: auto;
}
</style>
