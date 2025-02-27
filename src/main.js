import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import MapView from "./views/MapView.vue";

const routes = [
    {path: '/', component: MapView},
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

createApp(App)
    .use(router)
    .mount('#app')
