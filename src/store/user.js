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
    token: '',
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token,
  },
  actions: {
    async login(params) {
      const { code, msg, data } = await login(params)
      if (code === 200) {
        ElMessage.success(msg)
        this.userInfo = { ...data.user }
        this.saveToken(data.token)
        const routeStore = useRouteStore()
        await routeStore.createRoute()
        this.router.push({ name: 'MainBoard' })
      }
    },
    saveUserInfo (userInfo) {
      this.userInfo = userInfo
    },
    saveToken (token) {
      this.token = token
    },
  },
})