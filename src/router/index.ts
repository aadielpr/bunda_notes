import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Since we're using a single-page app structure, we'll create a simple wrapper
const AppWrapper = () => import('../App.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: AppWrapper
    },
    {
        path: '/note/:id',
        name: 'Note',
        component: AppWrapper
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 