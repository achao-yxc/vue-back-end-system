<template>
  <div class="page-list question-management-list">
    <div class="search">
      <el-form label-position="left" inline :model="form">
        <el-form-item>
          <el-input v-model="form.questionName" placeholder="问题名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.subjectId" placeholder="科目" clearable @change="changeSubject">
            <el-option v-for="item in subjectList" :key="item._id" :label="item.subjectName" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getlist">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="goPage('add')">新增</el-button>
      <el-button type="danger" @click="deleteSelected">批量删除</el-button>
      <el-button type="success" @click="dialogVisible = true">导入</el-button>
    </div>
    <el-table :data="tableData" border stripe class="table" @selection-change="handleSelectionChange">
      <template #empty>
        <div>暂无数据</div>
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="subjectName" label="所属科目" />
      <el-table-column prop="questionName" label="问题名称" />
      <el-table-column prop="type" label="问题类型" />
      <el-table-column prop="score" label="分值" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goPage(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteSingle(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next, jumper" :total="total" class="pagination" :page-size="form.pageSize" v-model:current-page="form.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog v-model="dialogVisible" title="导入">
      <el-table :data="[templateFile]" header-cell-class-name="table-header" class="dialog-table">
        <el-table-column label="模板文件" prop="name" />
        <el-table-column label="操作" width="150">
          <template #default>
            <div class="table-cell-btn">
              <el-button type="primary" @click="downloadFile(fileId, templateFile.name)">下载</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-upload
        v-model:file-list="fileList"
        action="#"
        :http-request="salfUpload"
        :on-remove="handleRemove"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, onActivated } from 'vue'
  import { useRouter } from 'vue-router'
  import { list, deleteOne, deleteMany, fileStream, fileStreamManual, importData, upload } from '@/api/main'
  import { ElButton, ElMessage, ElTableColumn } from 'element-plus'
  import { downloadFile } from '@/utils/main'

  defineOptions({
    name: 'QuestionManagementList'
  })

  onActivated(async () => {
    // console.log('question onActivated')
    await getSubjectList()
    getlist()
  })

  const router = useRouter()
  const apiKey = 'question'
  const form = reactive({
    pageNo: 1,
    pageSize: 10,
    questionName: '',
    subjectId: '',
  })
  const tableData = ref([])
  const total = ref(0)

  const subjectList = ref([]),
    templateFile = reactive({
      name: '',
      url: ''
    }),
    fileId = ref('')
  const getSubjectList = async () => {
    const { data } = await list('subject', {})
    subjectList.value = data
    if (data.length > 0) {
      form.subjectId = data[0]._id
      fileId.value = data[0].fileId
      templateFile.name = data[0].fileList[0].fileName
    }
  }

  const getlist = async () => {
    const { data, total: totalItems } = await list(apiKey, form)
    tableData.value = data.map(ele => {
      return {
        ...ele,
        subjectName: subjectList.value.find(item => item._id === ele.subjectId)?.subjectName || ''
      }
    })
    total.value = totalItems
  }

  const goPage = (value) => {
    if (value == 'add') {
      router.push({ name: 'QuestionManagementDetail' })
    } else {
      router.push({ name: 'QuestionManagementDetail', query: { id: value._id } })
    }
  }

  const deleteSingle = async (_id) => {
    const { code, msg } = await deleteOne(apiKey, { _id })
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      getlist()
    }
  }

  const selectedRows = ref([])
  const deleteSelected = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage({ message: '请至少选择一项', type: 'warning' })
      return
    }
    const { code, msg } = await deleteMany(apiKey, { ids: selectedRows.value })
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      getlist()
    }
  }

  const handleSelectionChange = (val) => {
    selectedRows.value = val.map(item => item._id)
  }

  const handleSizeChange = (val) => {
    form.pageSize = val
    getlist()
  }

  const handleCurrentChange = (val) => {
    form.pageNo = val
    getlist()
  }

  const dialogVisible = ref(false),
    fileList = ref([])
  const salfUpload = async (options) => {
    // console.log('salfUpload', options)
    // debugger
    const { file } = options
    fileList.value = [file]
    // console.log('salfUpload end', fileList.value)

    // const formData = new FormData()
    // formData.append('file', file)
    // const { data } = await upload(formData)
    // fileList.value = [{ ...data, uid: data._id }]
    // form.value.fileId = data._id
  }
  const handleRemove = (file, fileList) => {
    // 模拟删除文件
    ElMessage({ message: '文件已删除', type: 'info' })
  }
  // const importData = () => {
  //   ElMessage({ message: '导入功能待开发', type: 'info' })
  // }
  const confirm = async () => {
    // const formData = new FormData()
    // formData.append('file', fileList.value[0])
    // const { code, data: { filePath} } = await upload(formData)
    // if (code === 200) {
      const { code: importCode } = await importData('question', { filePath: '' })
      if (importCode === 200) {
        ElMessage({ message: '导入成功', type: 'success' })
        dialogVisible.value = false
        getlist()
      } else {
        ElMessage({ message: '导入失败', type: 'error' })
      }
    // }
  }

  // const downloadTemplate = async () => {
  //   const res = await fileStream({ _id: fileId.value })
  //   const blob = new Blob([res], {
  //     type: 'application/octer-stream',
  //   })
  //   const link = document.createElement('a')
  //   link.style.display = 'none'
  //   link.href = URL.createObjectURL(blob)
  //   link.download = templateFile.name
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  // const downloadFile = async (url, name) => {
  //   // 6a15d0f1a3c4885b852e8426 6a0f13b37f79f7b4b238adf9
  //   window.open('http://localhost:5173/api/file/download?_id=6a15d0f1a3c4885b852e8426')
  // }

  // const downloadFile3 = () => {
  //   window.open('http://localhost:5173/api/file/downloadStream?_id=6a15d0f1a3c4885b852e8426')
  // }

  // const downloadFile2 = async (fileId) => {
  //   const res = await fileStreamManualSetting({ _id: fileId })
  //   const blob = new Blob([res], {
  //     type: 'application/octer-stream',
  //   })
  //   const link = document.createElement('a')
  //   link.style.display = 'none'
  //   link.href = URL.createObjectURL(blob)
  //   link.download = templateFile.name
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  const changeSubject = (value) => {
    const { fileList } = subjectList.value.find(subject => subject._id === value)
    // console.log(subject)
    fileId.value = fileList[0]._id
    templateFile.name = fileList[0].fileName
  }
</script>

<style lang="scss">
.question-management-list {
  .dialog-table {margin-bottom: 20px;}
  .table-cell-btn {text-align: center;}
}
</style>