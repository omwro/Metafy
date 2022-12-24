// This class is meant to cast the spotify class to our own to reduce data size
import {Artist} from "/src/models/Artist";

import moment from "moment";

export class Song {
    constructor(spotifyTrack) {
        const { track } = spotifyTrack
        this.id = track.id
        this.uri = track.uri
        this.name = track.name
        this.artists = track.artists.map((artist) => new Artist(artist))
        this.duration_ms = track.duration_ms
        this.preview_url = track.preview_url
        this.release_date = moment(track.album.release_date).unix()
        if (track["external_urls"]) this.externalUrl = track["external_urls"]["spotify"]
        if (!track["external_urls"]) this.externalUrl = track.external_urls
        this.playlists = []
        this.img = track.album.images.length ? track.album.images.at(-1).url : null
    }
}