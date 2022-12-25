import Vue from 'vue'
import App from './App.vue'
import './main.css'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'
import axios from 'axios';
import Notifications from 'vue-notification'
import {SpotifyAuthService} from "/src/spotify/spotifyAuthService";
import './assets/tailwind.css';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faHouse,
    faBolt,
    faTag,
    faBarsStaggered,
    faRotate,
    faPlus,
    faSpinner,
    faArrowLeft,
    faMinus,
    faEquals
} from '@fortawesome/free-solid-svg-icons';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';

Vue.config.productionTip = false
Vue.use(Notifications)
library.add(
    faHouse,
    faBolt,
    faTag,
    faBarsStaggered,
    faRotate,
    faPlus,
    faSpotify,
    faSpinner,
    faArrowLeft,
    faMinus,
    faEquals
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.prototype.$audio = new Audio()

new Vue({
    router,
    store,
    axios,
    render: h => h(App)
}).$mount('#app')

// Request interceptor for API calls
axios.interceptors.request.use(async function (config) {
        if (store.state.refreshToken && SpotifyAuthService.isAccessTokenExpired()) {
            await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        }
        if (store.state.accessToken) {
            config.headers.Authorization = "Bearer " + store.state.accessToken;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const {response} = error;
    if (response.status === 429) {
        const waitInSeconds = parseInt(response.headers['retry-after']) + 1
        console.warn(`Retrying this request after ${waitInSeconds} seconds`)
        await new Promise(resolve => setTimeout(resolve, waitInSeconds * 1000));
        return axios.request(response.config)
    } else if (response.status === 503) {
        const waitInSeconds = 10
        console.warn(`Retrying this request after ${waitInSeconds} seconds`)
        await new Promise(resolve => setTimeout(resolve, waitInSeconds * 1000));
        return axios.request(response.config)
    } else {
        return Promise.reject(error);
    }
});