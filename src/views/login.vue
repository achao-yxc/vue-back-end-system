<template>
  <div class="p-login">
    <div class="login-box">
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="用户密码" @keyup.enter="userlogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="userlogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { login } from '@/api/main'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/user'
  import { useRouteStore } from '@/store/route'

  const router = useRouter()
  const userStore = useUserStore()
  const routeStore = useRouteStore()

  const formRef = ref(null),
  form = reactive({}),
  rules = reactive({
    username: [
      { required: true, message: '请填写', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请填写', trigger: 'blur' }
    ],
  })
  const userlogin = async () => {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        routeStore.createRoute()
        userStore.login(form)
      }
    })
  }
</script>

<style lang="scss">
.p-login {position: relative; width: 100vw; height: 100vh;
  .login-box {position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 250px;}
  .button {width: 100%;}
}
</style>