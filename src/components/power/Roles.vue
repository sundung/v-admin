<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addRolesDialog"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 扩展列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索隐列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showAddRolesDialogByID(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >

            <el-button size="mini" type="warning" icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 点击添加角色按钮,弹出对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showAddRolesDialog"
      width="60%"
      @closed="addRolesDialogClosed"
    >
      <!-- 添加角色主体区域 -->
      <el-form
        :model="addRolesForm"
        status-icon
        :rules="addRolesRules"
        ref="addRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击修改角色 弹出修改角色对话框-->
    <el-dialog title="修改角色" :visible.sync="showEditRolesDialog" width="60%">
      <!-- 添加角色主体区域 -->
      <el-form
        :model="editRolesForm"
        status-icon
        :rules="editRolesRules"
        ref="editRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制 添加用户的对话框显示与隐藏
      showAddRolesDialog: false,
      // 添加角色信息
      addRolesForm: {},
      // 添加角色的表单验证规则
      addRolesRules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        roleDesc: []
      },
      // 控制 修改角色对话框的显示与隐藏
      showEditRolesDialog: false,
      // 编辑角色信息
      editRolesForm: {},
      // 编辑角色的表单验证规则
      editRolesRules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        roleDesc: []
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 点击添加角色按钮,弹出添加角色对话框
    addRolesDialog() {
      this.showAddRolesDialog = true
    },
    // 点击添加角色按钮,添加角色
    addRoles() {
      // 验证
      this.$refs.addRolesFormRef.validate(async vaild => {
        if (!vaild) return
        // 验证通过
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        // 成功,则关闭对话框
        this.showAddRolesDialog = false
        // 刷新用户列表
        this.getRolesList()
        // 提示添加角色成功
        return this.$message.success('添加角色成功')
      })
    },
    // 监听添加角色对话框关闭事件- 情况添加角色表单
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 点击编辑角色按钮-事件
    async showAddRolesDialogByID(id) {
      // 打开对话框
      this.showEditRolesDialog = true
      // 查询编辑角色
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.editRolesForm = res.data
    },
    // 点击修改角色弹框的确定按钮
    editRoles() {
      // 验证
      this.$refs.editRolesFormRef.validate(async vaild => {
        if (!vaild) return
        // 验证通过
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('修改角色失败')
        }
        // 成功,则关闭对话框
        this.showEditRolesDialog = false
        // 刷新用户列表
        this.getRolesList()
        // 提示添加角色成功
        return this.$message.success('修改角色成功')
      })
    },
    // 点击删除按钮,删除角色
    async removeRolesById(id) {
      const res = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.warning('已经取消删除角色')
      }
      // 发起网络请求
      const { data: result } = await this.$http.delete('roles/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      // 刷新用户列表
      this.getRolesList()
    }
  }
}
</script>

<style></style>
