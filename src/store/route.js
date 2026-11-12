import { defineStore } from 'pinia'
import { list } from '@/api/main'
import { ElMessage } from 'element-plus'

const modules = import.meta.glob('@/views/**/*.vue')

// 将路由数据转换为树形结构
const route2Tree = (routes) => {
  const tree = []
  const routeMap = new Map()

  routes.forEach(route => {
    routeMap.set(route._id, { ...route, children: [] })
  })

  routes.forEach(route => {
    const node = routeMap.get(route._id),
      parent = routeMap.get(route.parentId)

    if (parent) {
      parent.children.push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}

export const useRouteStore = defineStore('route', {
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    routes: [],
    routeTree: [],
  }),
  getters: {
    getRoute: (state) => state.routes,
    getRouteTree: (state) => state.routeTree,
  },
  actions: {
    async createRoute(routes) {
      for (let route of routes) {
        const { component, path, name, routeName, routeType } = route
        if (!component || component === 'Layout') continue
        const componentPath = component.replace('@/', '/src/')
        this.router.addRoute('viewMain', {
          path,
          name,
          component: modules[componentPath],
          meta: { title: routeName, type: routeType }
        })
      }

      this.routes = [...routes]
      this.routeTree = route2Tree(routes)
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