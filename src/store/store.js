import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import moment from "moment";
import {Tag} from "../models/Tag";

Vue.use(Vuex)

export const DYNAMIC = "Dynamic"

const getDefaultState = () => {
    return {
        codeVerifier: null,
        codeChallenge: null,
        authorizationCode: null,
        authorizationState: null,
        accessToken: null,
        refreshToken: null,
        refreshedOn: null,
        expiresIn: moment(),
        user: null,
        playlists: [],
        likedTracks: [],
        taggedTracks: {},
        tags: []
    }
}

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: getDefaultState,
    mutations: {
        codeVerifier(state, value) {
            state.codeVerifier = value;
        },
        codeChallenge(state, value) {
            state.codeChallenge = value;
        },
        authorizationCode(state, value) {
            state.authorizationCode = value;
        },
        authorizationState(state, value) {
            state.authorizationState = value;
        },
        accessToken(state, value) {
            state.accessToken = value;
        },
        refreshToken(state, value) {
            state.refreshToken = value;
        },
        refreshedOn(state, value) {
            state.refreshedOn = value;
        },
        expiresIn(state, value) {
            state.expiresIn = value;
        },
        user(state, value) {
            state.user = value;
        },
        playlists(state, value) {
            state.playlists = value;
        },
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        likedTracks(state, value) {
            state.likedTracks = value;
        },
        taggedTracks(state, value) {
            state.taggedTracks = value
        },
        tags(state, value) {
            state.tags = value
        },
        addSongTag(state, array) {
            const song = array[0]
            const tag = array[1]
            if (Object.prototype.hasOwnProperty.call(state.taggedTracks, song.id)) {
                state.taggedTracks[song.id].push(tag)
            } else {
                state.taggedTracks[song.id] = [tag]
            }
        }
    },
    getters: {
        isLoggedIn: state => () => {
            return state.accessToken != null;
        },
        getPlaylistFromId: state => (id) => {
            return state.playlists.filter(pl => pl.id === id).pop()
        },
        getDynamicPlaylists: state => () => {
            return state.playlists.filter(pl => pl.category === DYNAMIC)
        },
        getTaggedPlaylists: state => () => {
            const taggedList = []
            state.playlists
                .filter(pl => pl.category !== DYNAMIC && pl.category !== undefined)
                .forEach((pl) => {
                    if (!taggedList.filter((tl) => tl.category === pl.category).length) {
                        taggedList.push({
                            category: pl.category,
                            playlists: []
                        })
                    }
                    taggedList.filter((tl) => tl.category === pl.category)[0]
                        .playlists
                        .push(pl)
                })
            return taggedList
        },
        getUntaggedPlaylists: state => () => {
            return state.playlists.filter(pl => pl.category === undefined)
        },
        // eslint-disable-next-line no-unused-vars
        getTaggedSongs: state => getters => () => {
            let taggedSongs = {}
            getters.getTaggedPlaylists()
                .forEach((cat) => {
                    cat.playlists.forEach((pl) => {
                        pl.songs.forEach((s) => {
                            if (Object.prototype.hasOwnProperty.call(taggedSongs, s.id)) {
                                taggedSongs[s.id].push(new Tag(pl.category, pl.tag, pl.id))
                            } else {
                                taggedSongs[s.id] = [new Tag(pl.category, pl.tag, pl.id)]
                            }
                        })
                    })
                })
            return taggedSongs
        },
        getTaggedTracksById: state => (id) => {
            return Object.prototype.hasOwnProperty.call(state.taggedTracks, id) ? state.taggedTracks[id] : null
        },
        // eslint-disable-next-line no-unused-vars
        getTagsFromTaggedPlaylists: state => (getter) => {
            const tagSet = new Set()
            getter
                .getTaggedPlaylists()
                .map((cat) => cat.playlists)
                .flat()
                .forEach((pl) => tagSet.add(new Tag(pl.category, pl.tag, pl.id)))
            return Array.from(tagSet)
        },
        getSelectTags: state => () => {
            return state.tags.map((t) => {
                return {
                    text: `${t.category} - ${t.tag}`,
                    value: t
                }
            })
        }
    },
    modules: {}
})
