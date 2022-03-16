// This class is meant to cast the spotify class to our own to reduce data size
import {Artist} from "@/models/Artist";

import store from "@/store/store";


export class Song {
    constructor(spotifyTrack) {
        const { track } = spotifyTrack
        this.id = track.id
        this.uri = track.uri
        this.name = track.name
        this.artists = track.artists.map((artist) => new Artist(artist))
        this.duration_ms = track.duration_ms
        this.preview_url = track.preview_url
        if (track["external_urls"]) this.externalUrl = track["external_urls"]["spotify"]
        if (!track["external_urls"]) this.externalUrl = track.external_urls
        this.tags = store.getters.getTaggedTracksById(track.id)
    }
}