<template>
    <div>
        <h1 class="text-center">Let's vibe with Metafy!</h1>

        <div class="mx-0">
            <div class="playlist-container dark-background">
                <QuickTools/>
            </div>
        </div>

        <h2 class="text-center">Your dynamic playlists</h2>
        <PlaylistContainer :playlists="$store.getters.getDynamicPlaylists()"/>

        <h2 class="text-center">Your tagged playlists</h2>
        <div v-for="taggedPlaylists in $store.getters.getTaggedPlaylists()" :key="taggedPlaylists.category">
            <h3 class="text-center">{{ taggedPlaylists.category }}</h3>
            <PlaylistContainer :playlists="taggedPlaylists.playlists"/>
        </div>

        <h2 class="text-center">Your untagged playlists</h2>
        <PlaylistContainer :playlists="$store.getters.getUntaggedPlaylists()"/>

        <div>
            <div>
                <h2 class="text-center">Your Liked Songs</h2>
            </div>
        </div>
        <div class="playlist-container dark-background fitcontent">
            <div>
                <div label="Hide languages"/>
            </div>
            <div>
                <div label="Hide Genre"/>
            </div>
            <div>
                <div label="Hide Mood"/>
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

    </div>
</template>

<script>
import store from "/src/store/store";
import {Playlist} from "/src/models/Playlist";
import QuickTools from "/src/components/QuickTools";
import PlaylistContainer from "/src/components/PlaylistContainer";
import SongCard from "/src/components/SongCard";

export default {
    name: "Dashboard",
    components: {SongCard, PlaylistContainer, QuickTools},
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

<style lang="scss" scoped>
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

    &:hover {
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