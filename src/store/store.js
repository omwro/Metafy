import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        codeVerifier: null,
        codeChallenge: null,
        authorizationCode: null,
        authorizationState: null,
        accessToken: null,
        refreshToken: null,
        playlists: []
    },
    mutations: {
        codeVerifier (state, value) {
            state.codeVerifier = value;
        },
        codeChallenge (state, value) {
            state.codeChallenge = value;
        },
        authorizationCode (state, value) {
            state.authorizationCode = value;
        },
        authorizationState (state, value) {
            state.authorizationState = value;
        },
        accessToken (state, value) {
            state.accessToken = value;
        },
        refreshToken (state, value) {
            state.refreshToken = value;
        },
        playlists (state, value) {
            state.playlists = value;
        }
    },
    getters: {
        isLoggedIn: state => {
            return state.accessToken != null;
        }
    },
    actions: {},
    modules: {}
})
