import { createApp } from 'vue'
import Root from './Root.vue'
import './style.css'
import router from './router'

const app = createApp(Root)
app.use(router)
app.mount('#app') 