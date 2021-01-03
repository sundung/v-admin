<template>
  <div class="login-wrapper">
    <div class="login-form">
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="loginIn">登录</el-button>
          <el-button type="info" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单的绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 16, message: '账号4-16位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 16, message: '密码4-16位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置操作
    handleReset() {
      this.$refs.loginForm.resetFields()
    },
    // 登录操作
    loginIn() {
      this.$refs.loginForm.validate(async valida => {
        if (!valida) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 判断返回的状态
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        // 存储 token 令牌
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功跳转到首页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-wrapper {
  background-color: #2c3940;
  width: 100%;
  height: 100%;
  .login-form {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    padding-top: 50px;
    box-sizing: border-box;
    .btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
