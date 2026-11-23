import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// const baseURL = process.env.NODE_ENV == 'development' ? services.development : services.production
// let baseURL = 'http://10.62.29.136:3000/'
// let baseURL = '/api'
let instance = axios.create({
  baseURL: '/api',
  timeout: 20 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截
instance.interceptors.request.use(config => {
  debugger
  // console.log(config)
  const userStore = useUserStore()
  // const { token } = userStore
  const { token } = storeToRefs(userStore)
  // 规范写法 不可随意自定义
  if (token.value) config.headers['Authorization'] = `Bearer ${token.value}`
  // if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') config.data = qs.stringify(config.data)

  return config;
}, error => {
  console.log(error);
  // utl.storage.sessionStorage.setStore("requestSwitch","OK");
})

// 响应拦截
instance.interceptors.response.use(response => {
  console.log(response);
  const { data: {code, msg} } = response
  switch (code) {
  //   case 401:
  //     Toast.fail(msg)
  //     router.push({ name: 'RegisterIndex' })
  //     break;
    case 500:
      ElMessage.error(msg)
      break;
    default:
      break;
  }

  return response.data
}, error => {
  console.log(error);
  // utl.storage.sessionStorage.setStore("requestSwitch","OK");
  const { status, response } = error
  ElMessage.error(response.data.message)
  const userStore = useUserStore()
  const router = useRouter()

  switch (status) {
    case 401:
      userStore.saveToken(null)
      // router.push({ name: 'login' })
      break
    default:
      break
  }

  return response.data
})

export default instance