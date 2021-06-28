// This class is meant to cast the spotify class to our own to reduce data size
export class Artist {
    constructor(spotifyArtist) {
        this.id = spotifyArtist.id
        this.name = spotifyArtist.name
    }
}