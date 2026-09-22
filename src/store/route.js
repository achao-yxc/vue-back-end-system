import { defineStore } from 'pinia'
import { list } from '@/api/main'
import { ElMessage } from 'element-plus'

const modules = import.meta.glob('@/views/**/*.vue')
// console.log('modules', modules)

// const handleRoute = (routes, router) => {
//   for (let item of routes) {
//     // debugger
//     const { component, children, path, name, routeName, routeType } = item
//     if (component === 'Layout') {
//       if (children && children.length > 0) {
//         handleRoute(children, router)
//       }
//     }
//     else {
//       const componentPath = component.replace('@/', '/src/')
//       router.addRoute('viewMain', {
//         path,
//         name,
//         component: modules[componentPath],
//         meta: { title: routeName, type: routeType }
//       })
//     }
//   }
// }

export const useRouteStore = defineStore('route', {
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    routes: [],
  }),
  getters: {
    getRoute: (state) => state.routes,
  },
  actions: {
    async createRoute() {
      const { code, msg, data } = await list('route', {})
      if (code === 200) {
        this.routes = [...data]
        this.handleRoute(data)
        // const result = this.router.getRoutes()
        // console.log('createRoute', result)
      }
      else {
        ElMessage.error(msg)
      }
    },
    handleRoute (routes) {
      for (let item of routes) {
        const { component, children, path, name, routeName, routeType } = item
        if (component === 'Layout') {
          if (children && children.length > 0) {
            this.handleRoute(children)
          }
        }
        else {
          const componentPath = component.replace('@/', '/src/')
          this.router.addRoute('viewMain', {
            path,
            name,
            component: modules[componentPath],
            meta: { title: routeName, type: routeType }
          })
        }
      }
    },
    saveRoute (routes) {
      this.routes = [...routes]
    }
  },
})