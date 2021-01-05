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
        <el-col>
          <el-button type="primary"
                     @click="addRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList"
                border
                stripe>
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <div>{{ scope.row }}</div> -->
            <el-row :class="['bdbottom', i === 0 ? 'bdtop' : '', 'vcenter']"
                    v-for="(item, i) in scope.row.children"
                    :key="item.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeThirdRolesById(scope.row, item.id)"
                        closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 三级权限-->
              <el-col :span="19">
                <el-row v-for="(item1, i1) in item.children"
                        :key="item1.id"
                        :class="[i1 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success"
                            @close="removeThirdRolesById(scope.row, item1.id)"
                            closable>{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeThirdRolesById(scope.row, item2.id)"
                            closable
                            type="warning"
                            :class="[i2 === 0 ? '' : 'bdtop']"
                            v-for="(item2, i2) in item1.children"
                            :key="item2.id">{{ item2.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索隐列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="showAddRolesDialogByID(scope.row.id)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="removeRolesById(scope.row.id)">删除</el-button>

            <el-button size="mini"
                       type="warning"
                       icon="el-icon-setting"
                       @click='setRightsRoleDialog(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击添加角色按钮,弹出对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="showAddRolesDialog"
               width="60%"
               @closed="addRolesDialogClosed">
      <!-- 添加角色主体区域 -->
      <el-form :model="addRolesForm"
               status-icon
               :rules="addRolesRules"
               ref="addRolesFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showAddRolesDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击修改角色 弹出修改角色对话框-->
    <el-dialog title="修改角色"
               :visible.sync="showEditRolesDialog"
               width="60%">
      <!-- 添加角色主体区域 -->
      <el-form :model="editRolesForm"
               status-icon
               :rules="editRolesRules"
               ref="editRolesFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showEditRolesDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击分配权限按钮,弹出的对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightsRoleDialogVisible"
               width="60%"
               @close='clearDefaultKeys'>
      <!-- 添加角色主体区域 -->
      <el-tree :data="rightsList"
               :props="treeProps"
               ref='treeRef'
               show-checkbox
               default-expand-all
               :default-checked-keys="defaultKeys"
               node-key="id"></el-tree>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightsRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
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
      },
      // 控制分配权限的按钮点击,弹出的对话框的显示与隐藏
      setRightsRoleDialogVisible: false,
      // 所有的权限数据
      rightsList: [],
      // 树形组件的绑定树形
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // tree 组件,默认勾选的数组
      defaultKeys: [],
      // 即将分配 权限的 id
      roleID: ''
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
    },

    // 点击三级权限按钮删除权限
    async removeThirdRolesById(roleId, rightID) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.warning('取消了删除权限操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${roleId.id}/rights/${rightID}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 不建议 使用 this.getRolesList() 因为会重新渲染整个表格
      // 数据返回的值中,包含了这个角色下的最新的数据,重新复制给,这个角色即可
      roleId.children = res.data
    },

    // 点击分配权限按钮,操作事件
    async setRightsRoleDialog(role) {
      // 保存 角色权限 id 以便 点击分配权限对话框 确定按钮事件 触发的时候,能拿到当前 操作的 角色 id
      this.roleID = role.id

      // 发起网络请求
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限列表失败哦')
      }

      // 将返回的权限数据保存到 data 中
      this.rightsList = res.data

      // 递归调用,获取 已存在的 三级权限
      this.getRecursiveKeys(role, this.defaultKeys)
      this.setRightsRoleDialogVisible = true
    },

    // 使用 递归函数(recursive),获取三级权限,并将获取的值,复制到 defaultKeys 数组中
    getRecursiveKeys(node, arr) {
      // 如果当前的 node 节点 没有 children,则证明 其 是 三级权限 存贮到一个数组中
      if (!node.children) {
        return arr.push(node.id)
      }

      // 递归调用
      node.children.map(item => this.getRecursiveKeys(item, arr))
    },

    // 监听 分配权限 对话框的关闭事件
    clearDefaultKeys() {
      // 关闭对话框时,情况  defaultKeys 数组
      this.defaultKeys = []
    },

    // 点击 分配权限 对话框 的确定按钮,触发的事件
    async allotRights() {
      // getCheckedKeys () 获取 选中的返回一个数组
      // getHalfCheckedKeys() 获取 半选中的返回一个数组

      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      // 拼接成 以英文逗号的字符串
      const idStr = keys.join(',')

      // 发起网络请求
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('角色分配授权失败')
      }
      // 成功通知
      this.$message.success('角色分配授权成功')
      // 刷新列表
      this.getRolesList()
      // 关闭弹出框
      this.setRightsRoleDialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
// 设置 一级权限的上下边框线
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 设置 水平垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>
