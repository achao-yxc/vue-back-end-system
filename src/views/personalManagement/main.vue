<template>
  <div class="page-detail">
    <!-- <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div> -->
    <el-form label-position="left" inline :model="form" class="box">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" type="number" placeholder="请输入年龄" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="女" value="0" />
          <el-option label="男" value="1" />
          <el-option label="未知" value="2" />
        </el-select>
      </el-form-item>
      <!-- todo <el-form-item label="所属部门"></el-form-item> -->
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="button" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail } from '@/api/main'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/store/user'

  defineOptions({
    name: 'personalManagementMain'
  })

  const router = useRouter(),
    route = useRoute(),
    apiKey = 'users',
    { userInfo } = useUserStore()
  // const form = ref({ ...userInfo })
  const form = ref({
    _id: userInfo._id,
    nickname: userInfo.nickname,
    age: userInfo.age,
    gender: userInfo.gender,
    description: userInfo.description
  })

  const getDetail = async () => {
    const { data } = await detail(apiKey, { _id: route.query.id })
    form.value = data
  }

  if (route.query.id) {
    getDetail()
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
      // router.back()
    }
  }
</script>