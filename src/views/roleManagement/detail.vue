<template>
  <div class="page-detail role-management-detail">
    <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
    <el-form label-position="left" inline :model="form">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色路由" class="w-100">
        <el-tree :data="treeData" node-key="_id" :default-expand-all="true" show-checkbox :default-checked-keys="form.routeIds" @check-change="handleCheckChange" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, onActivated } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail, list } from '@/api/main'
  import { ElMessage, ElTree } from 'element-plus'

  defineOptions({
    name: 'roleManagementDetail'
  })

  onActivated(() => {
    if (route.query.id) {
      getDetail()
    }
    else {
      form.value = {
        roleName: '',
        routeIds: [],
      }
    }
  })

  const router = useRouter(),
    route = useRoute(),
    apiKey = 'role'
  const form = ref({
    roleName: '',
    routeIds: [],
  })

  const getDetail = async () => {
    const { data } = await detail(apiKey, { _id: route.query.id })
    form.value = data
  }

  const save = async () => {
    if (form.value._id) {
      updateData()
    } else {
      addData()
    }
  }

  const addData = async () => {
    const { code, msg } = await add(apiKey, form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  const updateData = async () => {
    const { code, msg } = await updateOne(apiKey, form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  const handldRouteData = (routeData) => {
    routeData.forEach((val) => {
      const { routeName, parentId, children } = val
      val.label = routeName || '未命名'
      if (children && children.length > 0) {
        handldRouteData(children)
      }
    })
  }

  const treeData = ref([])
  const getRoutelist = async () => {
    const { data } = await list('route', {})
    handldRouteData(data)
    treeData.value = data
  }
  getRoutelist()

  const handleCheckChange = (data, checked, indeterminate) => {
    // console.log(data, checked, indeterminate)
    const { _id, parentId } = data
    if (checked) {
      if (!form.value.routeIds.includes(_id)) {
        form.value.routeIds.push(_id)
      }
    } else {
      form.value.routeIds = form.value.routeIds.filter(id => id !== _id)
    }
    // console.log(form.value.routeIds);
    
    // const getCheckedKeys = (nodes) => {
    //   let keys = []
    //   nodes.forEach((node) => {
    //     if (node.checked) {
    //       keys.push(node._id)
    //     }
    //     if (node.children && node.children.length > 0) {
    //       keys = keys.concat(getCheckedKeys(node.children))
    //     }
    //   })
    //   return keys
    // }
    // form.value.routeIds = getCheckedKeys(treeData.value)
  }
</script>

<style lang="scss">
.role-management-detail.page-detail {
  .w-100 {
    width: 100%;
  }
}
</style>