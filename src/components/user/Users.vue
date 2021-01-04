<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUsersList"
          >
            <el-button
              @click="getUsersList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUsersDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEidtDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分区区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 点击添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="60%"
      @closed="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addUsersRuleForm"
        status-icon
        :rules="addUsersRules"
        ref="addRuleFormRef"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsersRuleForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsersRuleForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsersRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUsersRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="60%"
      @closed="editDialogClosed"
    >
      <!-- 修改用户对话框主题 -->
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rules, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('邮箱不合法'))
    }
    // 自定义手机号校验规则
    var checkMobile = (rules, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('手机号不合法'))
    }
    return {
      queryInfo: {
        // 查询条件
        query: '',
        // 当前显示页数
        pagenum: 1,
        // 每页显示的条数
        pagesize: 2
      },
      // 用户列表
      usersList: [],
      // 总页数
      total: 0,
      // 控制添加用户的对话框显示与隐藏
      addDialogVisible: false,

      // 添加用户的表单数据
      addUsersRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 添加用户表单验证规则的对象
      addUsersRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名3-16位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '用户名6-16位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 控制修改用户对话框显示与隐藏
      editDialogVisible: false,

      // 修改用户的表单数据
      editForm: {
        email: '',
        mobile: ''
      },

      // 修改用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据裂变失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 监听pageSize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听页码值的改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听用户状态的改变
    async userStateChanged(state) {
      // console.log(state)
      // 发起网络请求
      const { data: res } = await this.$http.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      // 判断
      if (res.meta.status !== 200) {
        // 修改失败,将页面的用户状态重置回去
        state.mg_state = !state.mg_state
        return this.$message.error('修改用户状态失败')
      }
    },
    // 点击添加用户按钮,打开对话框
    addUsersDialog() {
      this.addDialogVisible = true
    },
    // 监听,添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 点击用户列表对话框,确定按钮
    addUser() {
      this.$refs.addRuleFormRef.validate(async vaild => {
        if (!vaild) return
        //  校验通过发起网络请求
        const { data: res } = await this.$http.post(
          'users',
          this.addUsersRuleForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        // 成功,则关闭对话框
        this.addDialogVisible = false
        // 刷新用户列表
        this.getUsersList()
        return this.$message.success('添加用户成功')
      })
    },
    // 点击修改用户按钮弹出,修改用户对话框
    async showEidtDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 监听 修改用户对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击 修改用户对话框,确定按钮 事件
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          // this.$message.error('修改用户信息失败')
          return
        }
        // 发起网络请求
        const { data: res } = await this.$http.put(
          'users/' +
            this.editForm.id +
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUsersList()
        // 提示对话框成功
        this.$message.success('修改用户数据成功')
      })
    }
  }
}
</script>

<style></style>
