// This class is meant to cast the spotify class to our own to reduce data size
import {CATEGORY_REGEX} from "@/spotify/spotifyService";
import {DYNAMIC} from "@/store/store";
import {getSubTagsFromDependencyString, splitDependencyString} from "@/utilities/Dependency";

export class Playlist {
    constructor(spotifyPlaylist) {
        this.id = spotifyPlaylist.id
        this.uri = spotifyPlaylist.uri
        this.name = spotifyPlaylist.name
        this.description = spotifyPlaylist.description
        this.category = undefined
        this.tag = spotifyPlaylist.name
        this.subtags = []
        this.dependency = []
        this.songs = []

        this.convert()
    }

    getTagFromName() {
        const category = this.name.match(CATEGORY_REGEX)[0].slice(1, -1).trim();
        const tag = this.name.substring(this.name.match(CATEGORY_REGEX)[0].length).trim()
        return {category, tag};
    }

    convert() {
        // Update properties in case it has a category
        if (this.name.match(CATEGORY_REGEX)) {
            const masterTag = this.getTagFromName();
            this.category = masterTag.category;
            this.tag = masterTag.tag;
            if (this.category === DYNAMIC) {
                this.dependency = splitDependencyString(this.description)
                this.subtags = getSubTagsFromDependencyString(this.description)
            }
        }
    }
}