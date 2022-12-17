import Vue from 'vue'
import App from './App.vue'
import './main.css'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'
import axios from 'axios';
import Notifications from 'vue-notification'
import {SpotifyAuthService} from "@/spotify/spotifyAuthService";
import './assets/tailwind.css'

Vue.config.productionTip = false
Vue.use(Notifications)

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
    } else {
        return Promise.reject(error);
    }
});