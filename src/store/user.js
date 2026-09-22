import { defineStore } from 'pinia'
import { login } from '@/api/main'
import { ElMessage } from 'element-plus'

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
        this.router.push({ name: 'MainBoard' })
      }
    }
  },
})