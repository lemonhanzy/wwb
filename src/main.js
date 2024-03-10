// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./css/Vip.css"
import "./css/Img.css"
import "./css/Posts.css"
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "element-plus/dist/index.css";

import ElementPlus from 'element-plus'  //引入element-plus库
import VForm3 from 'vform3-builds'  //引入VForm3库

import 'element-plus/dist/index.css'  //引入element-plus样式
import 'vform3-builds/dist/designer.style.css'  //引入VForm3样式


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VForm3)
app.mount('#app')
