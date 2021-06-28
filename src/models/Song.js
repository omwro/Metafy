// This class is meant to cast the spotify class to our own to reduce data size
import {Artist} from "@/models/Artist";

export class Song {
    constructor(spotifyTrack) {
        const { track } = spotifyTrack
        this.id = track.id
        this.name = track.name
        this.artists = track.artists.map((artist) => new Artist(artist))
        this.duration_ms = track.duration_ms
    }
}