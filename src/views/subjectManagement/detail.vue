<template>
  <div class="page-detail subject-management-detail">
    <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
    <el-form label-position="left" inline :model="form">
      <el-form-item label="科目名称">
        <el-input v-model="form.subjectName" placeholder="请输入科目名称" />
      </el-form-item>
      <el-form-item label="试题模板" class="w-100">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          :http-request="salfUpload"
          :before-upload="handleBeforeUpload"
          :on-remove="handleRemove"
          class="upload"
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, watch, onActivated } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail, upload, deleteOne } from '@/api/main'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'SubjectManagementDetail'
  })

  const router = useRouter(),
    route = useRoute(),
    apiKey = 'subject',
    form = ref({
      subjectName: '',
      fileList: [],
      fileId: '',
    })

  onActivated(() => {
    if (route.query.id) {
      getDetail()
    }
    else {
      form.value = {
        subjectName: '',
        fileList: [],
        fileId: '',
      }
    }
  })

  const fileList = ref([])

  const getDetail = async () => {
    const { data } = await detail(apiKey, { _id: route.query.id })
    form.value = data
    fileList.value = data.fileList.map(file => {
      const { _id, fileName, mimetype, size } = file
      return {
        uid: _id,
        name: fileName,
        type: mimetype,
        size,
      }
    })
    // console.log(fileList.value)
  }

  const save = async () => {
    if (form.value._id) {
      updateData()
    } else {
      addData()
    }
  }

  const addData = async () => {
    // const fileList = form.value.fileList.map(item => {
    //   delete item.uid
    //   delete item.status
    //   return item
    // })
    // form.value.fileList = fileList

    const { code, msg } = await add(apiKey, form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  const updateData = async () => {
    // const fileList = form.value.fileList.map(item => {
    //   delete item.uid
    //   delete item.status
    //   item.fileName = item.name
    //   item.mimetype = item.type
    //   return item
    // })

    const { code, msg } = await updateOne(apiKey, form.value)
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      router.back()
    }
  }

  const salfUpload = async (options) => {
    // console.log('salfUpload', options)
    const { file } = options
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await upload(formData)
    fileList.value = [{ ...data, uid: data._id }]
    form.value.fileId = data._id
    // console.log('salfUpload fileList', fileList.value)
  }

  const handleBeforeUpload = (options) => {
    console.log('handleBeforeUpload', options);
    
    // const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel'
    // if (!isExcel) {
    //   ElMessage({ message: '只能上传Excel文件', type: 'error' })
    // }
    // return isExcel
  }

  const handleRemove = async (file, filelist) => {
    console.log('handleRemove', file, filelist);
    const { uid, _id } = file
    const { msg, code } = await deleteOne('file', { _id })
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      fileList.value = []
      form.value.fileId = ''
    }
    console.log(fileList.value);
  }

  watch(() => fileList.value, (newVal) => {
    console.log('fileList changed', newVal)
    if (newVal.length > 0) {
      form.value.fileList = newVal.map(item => item.uid)
    }
    else {
      form.value.fileList = []
    }
  }, { deep: true })
</script>

<style lang="scss">
.subject-management-detail {
  .w-100 {
    width: 90%;
  }
  .upload {width: 300px;}
}
</style>