<template>
    <div v-if="isLoggedIn()">
        <div>
            <div>
                <h1 class="text-center">Let's vibe with Metafy!</h1>
            </div>
        </div>
        <div justify="center" class="mx-0">
            <div cols="auto" class="playlist-container dark-background">
                <QuickTools/>
            </div>
        </div>

        <div>
            <div>
                <h2 class="text-center">
                    Your dynamic playlists
                </h2>
            </div>
        </div>
        <div>
            <div class="playlist-container dark-background pa-0">
                <div
                    v-for="pl in $store.getters.getDynamicPlaylists()"
                    :key="pl.id"
                    @click="showPlaylistDetailDialog(pl)"
                    class="dynamic-card"
                >
                    <div>
                        {{ pl.tag }}
                        <div outlined class="ml-1 small-chip">
                            {{ pl.songs.length }}
                        </div>
                    </div>
                    <div>
                        <TagChip
                            v-for="subpl in pl.subtags"
                            :key="subpl.id"
                            :playlist="subpl"
                            :category="subpl.category"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div>
                <h2 class="text-center">Your tagged playlists</h2>
            </div>
        </div>
        <div>
            <div class="playlist-container dark-background">
                <template v-for="tpl in $store.getters.getTaggedPlaylists()">
                    <TagChip
                        v-for="pl in tpl.playlists"
                        :key="pl.id"
                        :playlist="pl"
                        :category="pl.category"
                        @click.native="showPlaylistDetailDialog(pl)"
                    />
                </template>
            </div>
        </div>

        <div>
            <div>
                <h2 class="text-center">Your untagged playlists</h2>
            </div>
        </div>
        <div>
            <div class="playlist-container dark-background">
                <TagChip
                    v-for="pl in $store.getters.getUntaggedPlaylists()"
                    :key="pl.id"
                    :playlist="pl"
                    @click.native="showPlaylistDetailDialog(pl)"
                />
            </div>
        </div>

        <div>
            <div>
                <h2 class="text-center">Your Liked Songs</h2>
            </div>
        </div>
        <div class="playlist-container dark-background fitcontent" justify="center">
            <div cols="auto">
                <div label="Hide languages" />
            </div>
            <div cols="auto">
                <div label="Hide Genre"/>
            </div>
            <div cols="auto">
                <div label="Hide Mood" />
            </div>
        </div>
        <div>
            <div class="playlist-container dark-background max-height">
                <SongCard
                    v-for="lt in getFilteredLikedTracks()"
                    :key="lt.id"
                    :song="lt"
                    tagged
                />
            </div>
        </div>

        <PlayListDetailDialog ref="playlistDetailDialog" />

    </div>
    <div v-else>
        <h1>Welcome to Metafy!</h1>
    </div>
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
        hidelang: false,
        hidegenre: false,
        hidemood: false
    }),
    methods: {
        isLoggedIn() {
            return store.getters.isLoggedIn();
        },
        isInstanceOfPlaylist(obj) {
            return Playlist.isInstance(obj)
        },
        showPlaylistDetailDialog(playlist) {
            this.$refs.playlistDetailDialog.playlist = playlist
            this.$refs.playlistDetailDialog.dialog = true
        },
        getFilteredLikedTracks() {
            return this.$store.state.likedTracks
                .filter((lt) => {
                    if (lt.tags === null) return true
                    const categoryList = lt.tags.map((t) => t.category).flat()
                    if (this.hidelang) {
                        if (categoryList.includes("Language")) return false
                    }
                    if (this.hidegenre) {
                        if (categoryList.includes("Genre")) return false
                    }
                    if (this.hidemood) {
                        if (categoryList.includes("Mood")) return false
                    }
                    return true
                })

        }
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
        .div::before {
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

.fitcontent {
    width: fit-content;
    margin-left: auto;
    margin: auto;
}
</style>
