<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary"
                   @click="showEditCateDialog">添加分类</el-button>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data="cateList"
                  :selection-type="false"
                  show-index
                  border
                  class="tree-table"
                  :expand-type="false"
                  :columns='columns'>
        <!-- 是否有效 -->
        <template slot='isOk'
                  slot-scope="scope">
          <i class="el-icon-success"
             style="color: lightgreen"
             v-if="scope.row.cat_deleted === false "></i>
          <i class="el-icon-error"
             style="color: red"
             v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1"
                  type="success">二级</el-tag>
          <el-tag v-else
                  type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot='opt'>
          <!-- slot-scope="scope" -->
          <el-button type="primary"
                     size="mini">编辑</el-button>
          <el-button type="danger"
                     size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[2,5,10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的弹出框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCatedialogVisible"
               @close="addCatedialogClosed"
               width="60%">
      <!-- 表单验证区域 -->
      <el-form ref="addCateFormRef"
               :model="addCateForm"
               :rules='addCateRules'
               label-width="80px">
        <el-form-item label="分类名称"
                      prop='cat_name'>
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectKeys"
                       expand-trigger="hover"
                       :options="addCateParentCateList"
                       :props="cascaderProps"
                       clearable
                       change-on-select
                       @change="addCateParentCateListHandleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        // 如果不传递，则默认获取所有级别的分类
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 商品分类 所有列表的数据
      cateList: [],

      // 总数据
      total: 0,

      // 为table 指定列
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],

      // 控制添加分类的弹出框的 显示与隐藏
      addCatedialogVisible: false,

      // 添加商品分类的表单绑定数据对象
      addCateForm: {
        // 要添加的分类名称
        cat_name: '',

        // 父级分类的id
        cat_pid: 0,

        // 分类等级,默认要添加的是一级分类
        cat_level: 0
      },

      // 添加商品分类的表单验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }

        ]
      },

      // 添加分类 弹出框 中的级联选择器的 数据
      addCateParentCateList: [],

      // 级联选择器的配置对象
      cascaderProps: {
        // 你选择的值
        value: 'cat_id',

        // 你看见的值
        label: 'cat_name',

        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },

      // 添加分类弹出框中的 级联选择器 选中的父级分类 的 id值
      selectKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }

      this.$message.success('获取商品分类成功')

      // 将商品分类数据 存储到 data 中
      this.cateList = res.data.result

      // 将总数据量 存储到 data 中
      this.total = res.data.total
    },

    // 监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize

      // 刷新数据
      this.getCateList()
    },

    // 监听 handleCurrentChange 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage

      // 刷新数据
      this.getCateList()
    },

    // 点击添加分类按钮,事件处理函数
    showEditCateDialog() {
      // 获取父级分类的数据
      this.getEditCateParentCateList()

      this.addCatedialogVisible = true
    },

    // 获取父级分类数据
    async getEditCateParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.addCateParentCateList = res.data
      console.log(this.addCateParentCateList)
    },

    // 添加分类弹出框 的 级联选择器 change 事件
    addCateParentCateListHandleChange() {
      // selectKeys

      // 如果 selectKeys 数组中的长度大于 0 则证明选中了 父级分类
      // 反之,则没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 将选中的父级分类 id 存储到 data 中
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]

        // 将选中的当前分类,赋值到 data 中
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        // 如果都没选择,重置 editCateForm 中的数据
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 点击添加分类 弹出框中的确定按钮的触发事件
    addCateConfirm() {
      // 验证表单
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$messge.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },

    // 监听 添加分类弹出框的关闭事件
    addCatedialogClosed() {
      // 1.情况 el-form 表单
      this.$refs.addCateFormRef.resetFields()

      // 2.重置 级联选择器
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }

  }

}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
