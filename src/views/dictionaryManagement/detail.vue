<template>
  <div class="page-detail dictionary-management-detail">
    <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
    <el-form label-position="left" inline :model="form">
      <el-form-item label="字典名称">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典编码">
        <el-input v-model="form.dictCode" placeholder="请输入字典编码" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" class="w-100">
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" class="remark" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref, onActivated } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail } from '@/api/main'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'DictionaryManagementDetail'
  })

  const router = useRouter(),
    route = useRoute(),
    apiKey = 'dictionary',
    form = ref({
      dictName: '',
      dictCode: '',
      status: 1,
      remark: '',
    })

  onActivated(() => {
    if (route.query.id) {
      getDetail()
    }
    else {
      form.value = {
        dictName: '',
        dictCode: '',
        status: 1,
        remark: '',
      }
    }
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
</script>

<style lang="scss">
.dictionary-management-detail {
  .w-100 {
    width: 90%;
  }
  .remark {
    width: 500px;
  }
}
</style>
