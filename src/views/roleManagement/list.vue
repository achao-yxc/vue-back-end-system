<template>
  <div class="page-list">
    <div>
      <el-form label-position="left" inline :model="form">
        <el-form-item>
          <el-input v-model="form.roleName" placeholder="角色名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getlist">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" @click="goPage('add')">新增</el-button>
      <el-button type="danger" @click="deleteSelected">批量删除</el-button>
    </div>
    <el-table :data="tableData" border class="table" @selection-change="handleSelectionChange">
      <template #empty>
        <div>暂无数据</div>
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="createTime" label="创建时间" width="120" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goPage(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteClick(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next, jumper" :total="total" class="pagination" :page-size="form.pageSize" v-model:current-page="form.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog title="提示" v-model="dialogVisible" width="500px">
      <span>确定删除选中数据吗？</span>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, onActivated } from 'vue'
  import { useRouter } from 'vue-router'
  import { list, deleteOne, deleteMany } from '@/api/main'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'roleManagementList'
  })

  onActivated(() => {
    getlist()
  })

  const router = useRouter()
  const apiKey = 'role'
  const form = reactive({
    pageNo: 1,
    pageSize: 10,
    roleName: '',
  })
  const tableData = ref([])
  const total = ref(0)
  const getlist = async () => {
    const { data, total: totalItems } = await list(apiKey, form)
    tableData.value = data
    total.value = totalItems
  }

  const goPage = (value) => {
    if (value == 'add') {
      router.push({ name: 'roleManagementDetail' })
    } else {
      router.push({ name: 'roleManagementDetail', query: { id: value._id } })
    }
  }

  const deleteSingle = async (_id) => {
    const { code, msg } = await deleteOne(apiKey, { _id })
    if (code === 200) {
      ElMessage({ message: msg, type: 'success' })
      getlist()
      dialogVisible.value = false
    }
  }

  const selectedRows = ref([])
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
    deleteWay = ref(null),
    deleteId = ref(null)

  const deleteClick = (id) => {
    dialogVisible.value = true
    deleteWay.value = 'single'
    deleteId.value = id
  }

  const deleteSelected = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage({ message: '请至少选择一项', type: 'warning' })
      return
    }
    dialogVisible.value = true
    deleteWay.value = 'many'
  }

  const confirmDelete = async () => {
    if (deleteWay.value === 'many') {
      const { code, msg } = await deleteMany(apiKey, { ids: selectedRows.value })
      if (code === 200) {
        ElMessage({ message: msg, type: 'success' })
        getlist()
        dialogVisible.value = false
      }
    }
    else if (deleteWay.value === 'single') {
      deleteSingle(deleteId.value)
    }
  }
</script>