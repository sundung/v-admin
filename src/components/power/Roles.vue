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
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
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
      <!-- 添加角色主题区域 -->
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
      // 添加角色
      addRolesForm: {},
      // 添加角色的表单验证规则
      addRolesRules: {
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
      console.log(this.rolesList)
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
        console.log(res)
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
    }
  }
}
</script>

<style></style>
