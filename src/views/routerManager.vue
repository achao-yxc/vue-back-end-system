<template>
  <div class="p-router-manager flex">
    <el-tree :data="treeData" @node-click="handleNodeChick" class="tree" highlight-current :expand-on-click-node="false" />
    <div class="flex-1">
      <div class="btnsgroup">
        <el-button type="primary" class="button" @click="addRoute">新增</el-button>
        <el-button type="danger" class="button" @click="delRoute">删除</el-button>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="routeName" label="路由名称">
          <el-input v-model="form.routeName" />
        </el-form-item>
        <el-form-item prop="name" label="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="path" label="path">
          <el-input v-model="form.path" />
        </el-form-item>
        <el-form-item prop="component" label="component">
          <el-input v-model="form.component" />
        </el-form-item>
        <el-form-item prop="routeType" label="类型">
          <el-select v-model="form.routeType" placeholder="请选择">
            <el-option label="菜单" value="menu" />
            <el-option label="路由" value="routing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { reactive, toRefs, ref } from 'vue'
  import { list, add, updateOne, deleteOne } from '@/api/main'
  import { ElMessage } from 'element-plus'
  import { useRouteStore } from '@/store/route'

  const routeStore = useRouteStore()
  const treeData = ref([]),
  handleNodeChick = (data) => {
    // console.log(data);
    const { _id, parentId } = data
    selectedRouteId = _id
    selectedRouteParentId.value = parentId
    form.value = data
  }

  let selectedRouteId = ''
  const selectedRouteParentId = ref({})

  const handldRouteData = (routeData) => {
    routeData.forEach((val) => {
      const { routeName, parentId, children } = val
      val.label = routeName || '未命名'
      if (children && children.length > 0) {
        handldRouteData(children)
      }
    })
  }

  const getlist = async () => {
    const { code, data } = await list('route', {})
    if (code == 200) {
      routeStore.saveRoute(data)
    }
    // data.forEach((val) => {
    //   const { routeName, parentId, children } = val
    //   // if (parentId == 'root') {}
    //   val.label = routeName
    //   if (children && children.length > 0) {
    //     val.children = children.map((child) => {
    //       child.label = child.routeName
    //       return child
    //     })
    //   }
    // })
    handldRouteData(data)
    treeData.value = data
  }
  getlist()

  const routeDataInit = (routeData) => {
    let handleData = []
    routeData.forEach(val => {
      const { parentId } = val
      if (parentId == 'root') {
        handleData.push(val)
      }
      else {}
    })
  }

  const formRef = ref(null),
  form = ref({}),
  rules = reactive([])

  const addRoute = () => {
    form.value = {}
    if (selectedRouteId) form.value.parentId = selectedRouteId
  }

  const save = async () => {
    if (form.value._id) {
      const { code, msg } = await updateOne('route', form.value)
      if (code == 200) {
        ElMessage({ message: msg, type: 'success' })
        getlist()
      }
    }
    else {
      const { code, msg } = await add('route', form.value)
      if (code == 200) {
        ElMessage({ message: msg, type: 'success' })
        getlist()
      }
    }
  }

  const delRoute = async () => {
    if (!selectedRouteId) return ElMessage({ message: '请选择要删除的路由', type: 'warning' })
    const { code, msg } = await deleteOne('route', { _id: selectedRouteId, parentId: selectedRouteParentId.value, routeName: form.value.routeName })
    if (code == 200) {
      ElMessage({ message: msg, type: 'success' })
      getlist()
    }
    else {
      ElMessage({ message: msg, type: 'warning' })
    }
  }
</script> 

<style lang="scss">
  .p-router-manager {
    .tree {width: 200px;}
    .el-form {
      .el-form-item {
        width: 360px;
      }
    }
    .btnsgroup {margin-bottom: 18px;}
  }
</style>