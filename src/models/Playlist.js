// This class is meant to cast the spotify class to our own to reduce data size
export class Playlist {
    constructor(spotifyPlaylist) {
        this.id = spotifyPlaylist.id
        this.name = spotifyPlaylist.name
        this.description = spotifyPlaylist.description
        this.category = undefined
        this.tag = spotifyPlaylist.name
        this.subtags = []
        this.dependecy = undefined
        this.songs = []
    }
}