import store from "@/store/store";
import {Playlist} from "@/models/Playlist";
import {addSongs, equalizeSongs, removeSongs} from "@/utilities/Combination";

export const OPERATOR_REGEX = /[+|\-|=]+/g
export const COMBINATION_REGEX = /([[:alnum:]]+|[+|\-|=]+)/g

// Split the dependency string from "dwadwa+vrfrrdgdr" to a combined list like [Playlist, "+", Playlist]
export function splitDependencyString(string) {
    return string.split(COMBINATION_REGEX)
        .map((char) => {
            if (!char.match(OPERATOR_REGEX)) {
                const foundPlaylist = store.state.playlists.find((pl) => pl.id === char)
                return foundPlaylist ? new Playlist(foundPlaylist) : null
            }
            return char
        })
        .filter((char) => char !== null)
}

// Make a string from the dependency list
export function getDependencyStringFromList(dependencyList) {
    let string = ""
    dependencyList.forEach((dep) => {
        if (dep instanceof Playlist) string += dep.id
        else string += dep
    })
    return string
}

// Split the dependency string from "dwadwa+vrfrrdgdr" to subtags like [Playlist, Playlist]
export function getSubTagsFromDependencyString(string) {
    return string.split(OPERATOR_REGEX)
        .map((id) => {
            const foundPlaylist = store.state.playlists.find((pl) => pl.id === id)
            return foundPlaylist ? new Playlist(foundPlaylist) : null
        })
        .filter((id) => id !== null)
}

// Get songs based on the dependency list
export function getSongsFromDependencyList(dependencyList) {
    let songs = []
    let operator = null
    dependencyList.forEach((dep) => {
        if (dep instanceof Playlist) {
            // Get the latest instance from the state
            dep = store.getters.getPlaylistFromId(dep.id)
            switch (operator){
                case null:
                case "+":
                    songs = addSongs(songs, dep.songs)
                    break
                case "-":
                    songs = removeSongs(songs, dep.songs)
                    break
                case "=":
                    songs = equalizeSongs(songs, dep.songs)
                    break
            }
        } else {
            operator = dep
        }
    })
    return songs
}
