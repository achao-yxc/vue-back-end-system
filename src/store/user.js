import { defineStore } from 'pinia'
import { login } from '@/api/main'
import { ElMessage } from 'element-plus'
import { useRouteStore } from './route'

export const useUserStore = defineStore('user', {
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    userInfo: {},
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
  },
  actions: {
    async login(params) {
      const { code, msg, data } = await login(params)
      if (code === 200) {
        ElMessage.success(msg)
        this.userInfo = { ...data }
        const routeStore = useRouteStore()
        routeStore.createRoute(data.routes)
        this.router.push({ name: 'MainBoard' })
      }
    }
  },
})