import axios from 'axios'

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
// debugger
// 请求拦截
instance.interceptors.request.use(config => {
  // console.log(config)
  // const { token } = useUserStore()
  
  // if (token) config.headers['token'] = `${token}`
  // 规范写法 不可随意自定义
  // if (token) config.headers['Authorization'] = `Bearer ${token}`
  // if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') config.data = qs.stringify(config.data)

  return config;
}, error => {
  console.log(error);
  // utl.storage.sessionStorage.setStore("requestSwitch","OK");
})

// 响应拦截
instance.interceptors.response.use(response => {
  // console.log(response);
  // let {data, data: {status, msg}} = responsez
  // switch (status) {
  //   case 401:
  //     Toast.fail(msg)
  //     router.push({ name: 'RegisterIndex' })
  //     break;
  //   case 500:
  //     Toast.fail(msg)
  //     break;
  //   default:
  //     break;
  // }

  return response.data
}, error => {
  console.log(error);
  // utl.storage.sessionStorage.setStore("requestSwitch","OK");
})

export default instance