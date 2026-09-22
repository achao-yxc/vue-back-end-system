<template>
  <div class="page-detail">
    <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
    <el-form label-position="left" class="form" inline :model="form">
      <el-form-item label="姓名">
        <el-input v-model="form.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" placeholder="请输入年龄" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="女" value="0" />
          <el-option label="男" value="1" />
          <el-option label="未知" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
          <el-option v-for="role of roleList" :key="role._id" :label="role.roleName" :value="role._id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, onActivated } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail, list } from '@/api/main'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'userManagementDetail'
  })

  onActivated(() => {
    if (route.query.id) {
      getDetail()
    }
    else {
      form.value = { username: '', age: '', gender: '2', status: 1, roleIds: [] }
    }
  })

  const router = useRouter(),
    route = useRoute()
  const form = ref({ username: '', age: '', gender: '2', status: 1, roleIds: [] })

  const roleList = ref([])
  const getRoleList = async () => {
    const { data } = await list('role', { pageNo: 1, pageSize: 999 })
    roleList.value = data
  }
  getRoleList()

  const getDetail = async () => {
    const { data } = await detail('users', { _id: route.query.id })
    form.value = data
  }

  const save = async () => {
    if (form.value._id) {
      updateUser()
    } else {
      addUser()
    }
  }

  const addUser = async () => {
    const { code, msg } = await add('users', form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  const updateUser = async () => {
    const { code, msg } = await updateOne('users', form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  
</script>

<style lang="scss">
</style>