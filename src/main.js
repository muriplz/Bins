import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {TabList} from "primevue";
import PrimeVue from 'primevue/config';
import {definePreset} from "@primevue/themes";
import Aura from '@primevue/themes/aura';
import {createRouter, createWebHistory} from "vue-router";
import MapView from "./views/MapView.vue";

const routes = [
    {path: '/', component: MapView},
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const preset = definePreset(Aura, {
    components: {
        tabs: {
            tab: {
                padding: "0 10px 10px 10px",
                font: {
                    weight: "normal"
                }
            }
        },
        contextmenu: {
            item: {
                color: "inherit",
                focus: {
                    color: "inherit"
                },
                icon: {
                    color: "inherit",
                    focus: {
                        color: "inherit"
                    }
                }
            }
        },
        menu: {
            item: {
                color: "inherit",
                focus: {
                    color: "inherit"
                },
                icon: {
                    color: "inherit",
                    focus: {
                        color: "inherit"
                    }
                }
            }
        }
    }
});

createApp(App)
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: preset,
        }
    })
    .component("TabList", TabList)
    .mount('#app')
