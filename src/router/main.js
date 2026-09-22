import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login.vue'
import viewMain from '@/views/main.vue'
import MainBoard from '@/views/main/board.vue'
import notFound from '@/views/notFound.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import { useRouteStore } from '@/store/route'

const routes = [
  { path: '/login', component: login, name: 'login' },
  {
    path: '/main',
    name: 'viewMain',
    component: viewMain,
    children: [
      { path: 'board', name: 'MainBoard', component: MainBoard, meta: { title: '看板' } },
      // { path: 'routerManager', name: 'routerManager', component: () => import('@/views/routerManager.vue'), meta: { title: '路由管理' } },
      // { path: '/userManagement/list', name: 'userManagementList', component: () => import('@/views/userManagement/list.vue'), meta: { title: '用户管理' } },
      // { 
      //   path: '/userManagement/detail',
      //   name: 'userManagementDetail', 
      //   component: () => import('@/views/userManagement/detail.vue'), 
      //   meta: { title: '用户详情', type: 'routing' }
      // },
      // { path: 'roleManagement/list', name: 'roleManagementList', component: () => import('@/views/roleManagement/list.vue'), meta: { title: '角色管理' } },
      // { 
      //   path: 'roleManagement/detail', 
      //   name: 'roleManagementDetail', 
      //   component: () => import('@/views/roleManagement/detail.vue'), 
      //   meta: { title: '角色详情', type: 'routing' } 
      // },
      // { path: '/subjectManagement/list', name: 'SubjectManagementList', component: () => import('@/views/subjectManagement/list.vue'), meta: { title: '学科管理' } },
      // { 
      //   path: '/subjectManagement/detail', 
      //   name: 'SubjectManagementDetail', 
      //   component: () => import('@/views/subjectManagement/detail.vue'), 
      //   meta: { title: '学科详情', type: 'routing' } 
      // },
      // { path: '/questionManagement/list', name: 'QuestionManagementList', component: () => import('@/views/questionManagement/list.vue'), meta: { title: '题目管理' } },
      // {
      //   path: '/questionManagement/detail',
      //   name: 'QuestionManagementDetail',
      //   component: () => import('@/views/questionManagement/detail.vue'),
      //   meta: { title: '题目详情', type: 'routing' }
      // },
      // { path: '/dictionaryManagement/list', name: 'DictionaryManagementList', component: () => import('@/views/dictionaryManagement/list.vue'), meta: { title: '字典管理' } },
      // {
      //   path: '/dictionaryManagement/detail',
      //   name: 'DictionaryManagementDetail',
      //   component: () => import('@/views/dictionaryManagement/detail.vue'),
      //   meta: { title: '字典详情', type: 'routing' }
      // },
    ]
  },
  { path: '/404', name: 'notFound', component: notFound },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  // debugger
  // console.log('from', from)
  // console.log('to', to)
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  // console.log('userInfo', userInfo.value)
  const routeStore = useRouteStore()
  const { routes } = storeToRefs(routeStore)
  // 已登录
  if (userInfo.value.username) {
    const result = router.getRoutes()
    // 浏览器刷新
    if (result.length < 6 && routes.value.length > 0) {
      routeStore.handleRoute(routes.value)
      return { ...to, replace: true }
    }
    if (to.path === '/login') {
      return { name: 'viewMain' }
    }
  }
  else {
    if (to.path !== '/login') {
      return { name: 'login' }
    }
  }
})

export default router