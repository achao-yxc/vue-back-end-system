import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import './normalize.css'
import router from './router/main'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import { ElMessageBox } from 'element-plus'
import { msgBoxConfirm } from './hook/main'

const app = createApp(App)
app.use(router)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
// app.config.globalProperties.$messageBox = ElMessageBox
app.config.globalProperties.$msgBoxConfirm = msgBoxConfirm
app.mount('#app')