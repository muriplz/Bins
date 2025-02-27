import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import MapView from "./views/MapView.vue";

import { createInventoryState } from './components/ui/inventory/inventoryState.js';
import AuthService from "./js/auth/authService.js";

// Create inventory state before app initialization
export const inventoryState = createInventoryState();

const routes = [
    {path: '/', component: MapView},
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

AuthService.validate();

createApp(App)
    .use(router)
    .provide('inventoryState', inventoryState)
    .mount('#app')