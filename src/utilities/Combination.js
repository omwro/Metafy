// Combine 2 lists of songs and remove the duplicate
export function addSongs(list1, list2) {
    list1.push(...list2)
    return Array.from(new Set(list1))
}

// Remove the songs from list 2 in list 1
export function removeSongs(list1, list2) {
    return list1.filter((song) => !list2.includes(song))
}

// Filter out the songs that only exist in both lists
export function equalizeSongs(list1, list2) {
    return list1.filter((song) => list2.includes(song))
}