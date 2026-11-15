<template>
  <div class="page-list">
    <div class="searchBar">
      <el-form label-position="left" inline :model="form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="getlist">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group">
      <el-button type="primary" class="button" @click="goPage('add')">新增</el-button>
      <el-button type="danger" class="button" @click="deleteSelected">批量删除</el-button>
    </div>
    <el-table :data="userList" border class="table" @selection-change="handleSelectionChange">
      <template #empty>
        <div class="empty">暂无数据</div>
      </template>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column prop="username" label="姓名" width="150" align="center" />
      <el-table-column prop="age" label="年龄" width="100" align="center" />
      <el-table-column prop="gender" label="性别" width="100" align="center">
        <template #default="{ row }">
          {{ row.gender == '0' ? '女' : row.gender == '1' ? '男' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          {{ row.status == 1 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="120" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goPage(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteClick(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" v-model:current-page="form.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup>
  import { reactive, ref, onActivated, getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  import { list, deleteOne, deleteMany } from '@/api/main'
  import { ElMessage } from 'element-plus'

  defineOptions({
    name: 'userManagementList'
  })

  onActivated(() => {
    getlist()
  })

  const { proxy } = getCurrentInstance(),
    apiKey = 'users',
    form = reactive({
      username: '',
      pageNo: 1,
      pageSize: 10,
    })
  
  const userList = ref([])
  const total = ref(0)
  const getlist = async () => {
    const { data, total: totalItems } = await list(apiKey, form)
    userList.value = data
    total.value = totalItems
  }

  const router = useRouter()
  const goPage = (value) => {
    if (value == 'add') {
      router.push({ name: 'userManagementDetail' })
    } else {
      router.push({ name: 'userManagementDetail', query: { id: value._id } })
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

  const deleteSelected = () => {
    proxy.$msgBoxConfirm('确定删除选中数据吗？').then(async () => {
      if (selectedRows.value.length === 0) {
        ElMessage({ message: '请至少选择一项', type: 'warning' })
        return
      }
      const { code, msg } = await deleteMany(apiKey, { ids: selectedRows.value })
      if (code === 200) {
        ElMessage({ message: msg, type: 'success' })
        getlist()
      }
    })
  }

  const deleteClick = (_id) => {
    proxy.$msgBoxConfirm('确定删除该数据吗？').then(async () => {
      const { code, msg } = await deleteOne(apiKey, { _id })
      if (code === 200) {
        ElMessage({ message: msg, type: 'success' })
        getlist()
      }
    })
  }
</script>

<style lang="scss">
</style>