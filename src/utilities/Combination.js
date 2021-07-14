// Combine 2 lists of songs and remove the duplicate
export function addSongs(list1, list2) {
    list1.push(...list2)
    return list1.filter((value, index, array) => array.findIndex(song => (song.id === value.id)) === index)
}

// Remove the songs from list 2 in list 1
export function removeSongs(list1, list2) {
    return list1.filter((song) => !list2.map(l => l.id).includes(song.id))
}

// Filter out the songs that only exist in both lists
export function equalizeSongs(list1, list2) {
    return list1.filter((song) => list2.map(l => l.id).includes(song.id))
}