import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import axios from 'axios';
import {SpotifyAuthService} from "@/spotify/spotifyAuthService";
import Notifications from 'vue-notification'

Vue.config.productionTip = false
Vue.use(Notifications)

new Vue({
    router,
    store,
    vuetify,
    axios,
    render: h => h(App)
}).$mount('#app')

// Request interceptor for API calls
axios.interceptors.request.use(
    async config => {
        return config;
    },
    error => {
        Promise.reject(error)
    });

// Response interceptor for API calls
axios.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
        console.error("OMER: AXIOS INTERCEPTOR RESPONSE 403")
        originalRequest._retry = true;
        const response = await SpotifyAuthService.refreshAccessToken(store.state.refreshToken)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
        return axios(originalRequest);
    }
    return Promise.reject(error);
});