import { defineStore } from 'pinia'
import { login, userRoute } from '@/api/main'
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
        await routeStore.createRoute()
        this.router.push({ name: 'MainBoard' })
      }
    },
    async getUserRoute () {
      const { code, data } = await userRoute({userId: this.userInfo._id})
      if (code === 200) {
        const routeStore = useRouteStore()
        routeStore.createRoute(data)
      }
    },
  },
})