<template>
  <el-container class="p-main">
    <el-header class="header flex">
      <div class="header-title">系统</div>
      <div class="header-right flex">
        <el-avatar :size="35" :src="avatar" />
        <span class="name">用户名</span>
      </div>
    </el-header>
    <el-container class="container">
      <el-aside class="menu">
        <el-menu router :default-active="menuActive">
          <el-sub-menu :index="item.path" v-for="item in menuList" :key="item._id">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>{{ item.routeName }}</span>
            </template>
            <template v-if="item.children.length > 0">
              <template v-for="child in item.children" :key="child._id">
                <el-menu-item :index="child.path" @click="nodeChick(child)" v-if="child.routeType === 'menu'">
                  <el-icon><Setting /></el-icon>
                  <span>{{ child.routeName }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-tabs type="card" closable v-model="activeTab" @tab-click="handleTabClick" @tab-remove="handleTabsEdit">
          <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" :closable="tab.closable" />
        </el-tabs>
        <RouterView v-slot="{ Component, route }">
          <KeepAlive>
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import { reactive, toRefs, ref, watch } from 'vue'
  import avatar from '@/assets/vue.svg'
  import { Setting } from '@element-plus/icons-vue'
  import { useRouter, useRoute } from 'vue-router'
  import { list, add, updateOne, deleteOne } from '@/api/main'

  defineOptions({
    name: 'viewMain'
  })

  const router = useRouter()
  const route = useRoute()

  // console.log('router', router)
  // console.log('route', route)
  
  const menuList = ref(null),
    menuActive = ref(null)
  const getlist = async () => {
    const { data } = await list('route', {})
    menuList.value = data
  }

  // 监听路由变化，动态添加和删除标签页 
  watch(() => router.currentRoute.value, async (val, oldVal) => {
    // console.log('router.currentRoute', val, oldVal);
    if (oldVal) {
      const { meta: { type: oldType } } = oldVal
      if (oldType === 'routing') {
        const index = tabs.findIndex(tab => tab.name === oldVal.name)
        if (index !== -1) {
          tabs.splice(index, 1)
        }
      }
    }
    if (menuList.value === null) {
      await getlist()
    }
    const { path, meta: { type } } = val
    if (type !== 'routing') {
      menuActive.value = path
    }
    initTab()
  }, { immediate: true })

  const nodeChick = (data) => {
    // console.log(data);
    const { name, routeName } = data
    const hasTab = tabs.some(tab => tab.name === name)
    if (!hasTab) {
      tabs.push({ label: routeName, name, closable: true })
    }
    activeTab.value = name
  }

  const activeTab = ref('MainBoard')
  const tabs = reactive([
    { label: '看板', name: 'MainBoard', closable: false },
  ])
  const handleTabClick = (tab) => {
    // console.log('handleTabClick tab', tab)
    const { paneName } = tab
    router.push({ name: paneName })
  }
  const handleTabsEdit = (paneName) => {
    // console.log('paneName', paneName, 'action', action)
    const index = tabs.findIndex(tab => tab.name === paneName)
    if (index !== -1) {
      if (paneName === activeTab.value) {
        if (index + 1 == tabs.length) {
          activeTab.value = tabs[index - 1].name
        }
        else {
          activeTab.value = tabs[index + 1].name
        }
      }
      tabs.splice(index, 1)
      router.push({ name: activeTab.value })
    }
  }
  const initTab = () => {
    const { name, meta: { title } } = route
    const hasTab = tabs.some(tab => tab.name === name)
    if (!hasTab) {
      tabs.push({ label: title, name })
    }
    activeTab.value = name
  }
  
</script>

<style lang="scss">
.p-main {
  .header {background-color: #04002b; color: #fff;}
  .header-title {font-size: 18px; font-weight: bold;}
  .header-right {
    .name {margin-left: 15px;}
  }
  .container {height: calc(100vh - 60px);}
  .menu {background-color: #04002b;}
  .el-menu {background-color: #04002b;}
  .el-menu-item {color: #fff;}
  .el-menu-item.is-active {color: #ffd04b;}
  .el-menu-item:hover {background-color: #545c64;}
  .el-sub-menu__title {color: #fff;}
  .el-sub-menu__title:hover {background-color: #545c64;}
  .el-main {padding-top: 0;}
  .el-tabs{position: sticky; top: 0; padding-top: 20px; z-index: 9; background-color: #fff;}
}
</style>