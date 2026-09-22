<template>
  <div class="page-detail question-management-detail">
    <div class="flex jc-fe">
      <el-button type="primary" class="button" @click="save">保存</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
    <el-form label-position="left" inline :model="form">
      <el-form-item label="科目名称">
        <el-select v-model="form.subjectId" placeholder="请选择科目">
          <el-option v-for="item in subjectList" :key="item._id" :label="item.subjectName" :value="item._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="问题">
        <el-input v-model="form.questionName" placeholder="请输入问题" />
      </el-form-item>
      <el-form-item label="问题类型">
        <el-select v-model="form.type" placeholder="请选择问题类型">
          <el-option v-for="item in questionTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选项" class="w-90">
        <template v-for="(option, index) in form.options" :key="index">
          <div class="flex option-item">
            <el-input v-model="option.value" placeholder="请输入选项值，A、B、C" class="option-value" />
            <el-input v-model="option.text" placeholder="请输入选项文本" class="option-text" />
            <el-icon :size="20" color="#409EFF" @click="addOption" class="ml-10"><CirclePlus /></el-icon>
            <el-icon :size="20" color="#F56C6C" @click="removeOption(index)" class="ml-10"><Remove /></el-icon>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="答案">
        <el-input v-model="form.rightAnswer" placeholder="请输入答案" />
      </el-form-item>
      <el-form-item label="分值">
        <el-input v-model="form.score" placeholder="请输入分值" type="number" />
      </el-form-item>
      <el-form-item label="解析" class="col2">
        <el-input v-model="form.explain" placeholder="请输入解析" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, onActivated } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { add, updateOne, detail, list } from '@/api/main'
  import { ElMessage } from 'element-plus'
  import { CirclePlus, Remove } from '@element-plus/icons-vue'

  defineOptions({
    name: 'QuestionManagementDetail'
  })

  const router = useRouter(),
    route = useRoute(),
    apiKey = 'question',
    form = ref({
      questionName: '',
      options: [{ value: '', text: '' }],
      rightAnswer: '',
      explain: '',
      subjectId: '',
      score: 1,
    })

  onActivated(() => {
    if (route.query.id) {
      getDetail()
    }
    else {
      form.value = {
        questionName: '',
        options: [{ value: '', text: '' }],
        rightAnswer: '',
        explain: '',
        subjectId: '',
        score: 1,
      }
    }
  })

  const subjectList = ref([])
  const getSubjectList = async () => {
    const { data } = await list('subject', {})
    subjectList.value = data
  }
  getSubjectList()

  const questionTypeList = [
    { label: '单选题', value: '单选题' },
    // { label: '多选题', value: 'multiple' },
    // { label: '判断题', value: 'judge' },
  ]

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

  const addOption = () => {
    form.value.options.push({ value: '', text: '' })
  }

  const removeOption = (index) => {
    if (form.value.options.length === 1) return
    form.value.options.splice(index, 1)
  }
</script>

<style lang="scss">
.question-management-detail {
  .w-90 {width: 90%;}
  .ml-10 {margin-left: 10px;}
  .option-item {margin-bottom: 10px;}
  .option-value {width: 180px;}
  .option-text {width: 300px; margin-left: 10px;}
  .col2 {width: calc(64% + 32px);}
}
</style>