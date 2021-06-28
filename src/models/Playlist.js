// This class is meant to cast the spotify class to our own to reduce data size
import {CATEGORY_REGEX} from "@/spotify/spotifyService";
import {DYNAMIC} from "@/store/store";

export class Playlist {
    constructor(spotifyPlaylist, playlists) {
        this.id = spotifyPlaylist.id
        this.name = spotifyPlaylist.name
        this.description = spotifyPlaylist.description
        this.category = undefined
        this.tag = spotifyPlaylist.name
        this.subtags = []
        this.dependecy = undefined
        this.songs = []

        this.convert(playlists)
    }

    getTagFromName() {
        const category = this.name.match(CATEGORY_REGEX)[0].slice(1, -1).trim();
        const tag = this.name.substring(this.name.match(CATEGORY_REGEX)[0].length).trim()
        return {category, tag};
    }

    convert(playlists) {
        // Update properties in case it has a category
        if (this.name.match(CATEGORY_REGEX)) {
            const masterTag = this.getTagFromName();
            this.category = masterTag.category;
            this.tag = masterTag.tag;
            if (this.category === DYNAMIC) {
                this.dependecy = this.description
                this.subtags = this.dependecy.split(/[+-]/)
                    .map((id) => new Playlist(playlists.find((pl) => pl.id === id)))
            }
        }
    }
}