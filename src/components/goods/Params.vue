<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告消息 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                show-icon
                :closable="false"
                type="warning">
      </el-alert>
      <!-- 商品分类的级联选择器 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selectKeys"
                       expand-trigger="hover"
                       :options="ccateList"
                       :props="cateProps"
                       @change="handleCateChange"
                       clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 页签区域 -->
      <el-tabs v-model="activeName"
               @tab-click="handleClickTabs">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <!-- 添加动态参数的按钮 -->
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     size="mini"
                     @click="showAddDialog">动态参数</el-button>
          <!-- 动态参数列表 -->
          <el-table :data="manyTabsData"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary"
                           icon="el-icon-edit"
                           size='mini'>编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size='mini'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <!-- 添加静态属性的按钮 -->
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     size="mini"
                     @click="showAddDialog">静态属性</el-button>
          <!-- 静态参数列表 -->
          <el-table :data="onlyTabsData"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary"
                           icon="el-icon-edit"
                           size='mini'>编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size='mini'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!-- 动态参数/静态参数的公共弹出框 -->
    <el-dialog :title="'添加' + titleText"
               :visible.sync="addDialogVisible"
               @close="addDialogClosed"
               width="60%">
      <!-- 表单区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      ccateList: [],
      // 商品分类,级联选择器的绑定对象
      cateProps: {
        // 选中的值
        value: 'cat_id',

        // 看到的值
        label: 'cat_name',

        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 级联选择器,双向绑定到的数组
      selectKeys: [],

      // 被激活的 tabs 页签
      activeName: 'many',

      // tabs标签中的动态参数 数组
      manyTabsData: [],

      // tabs标签中的静态参数 数组
      onlyTabsData: [],

      // 控制,添加动态/静态参数的弹出框的显示与隐藏
      addDialogVisible: false,

      // 动态/静态参数 的表单绑定对象
      addForm: {},

      // 动态/静态参数 的表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 如果 tabs 页签中的按钮 需要禁用 则fanhuitrue,否则返回false
    isBtnDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },

    // 获取当前选中的 三级级联选择器 的 id
    getThreeCascaderId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },

    // 动态获取,动态参数 / 静态参数 弹出框的 title 标题的计算属性
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败')
      }
      this.ccateList = res.data
    },
    // 级联选择器的change 事件
    handleCateChange() {
      this.getParamsData()
    },

    // 点击tabs 页签 触发的事件
    handleClickTabs() {
      this.getParamsData()
      console.log(this.activeName)
    },

    // 抽离公共的获取参数的方法,级联选择器改变,tabs 切换都要发起网络请求,获取数据
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        return
      }
      // 证明所选择的是 三级级联选择器
      // 根据所选的分类 id 和 面板参数(many,only) 来获取 动态参数,和 静态参数 数据

      const { data: res } = await this.$http.get(
        `categories/${this.getThreeCascaderId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }

      console.log(res)

      if (this.activeName === 'many') {
        this.manyTabsData = res.data
      } else {
        this.onlyTabsData = res.data
      }
    },

    // 点击 添加参数按钮 弹出,动态/静态参数 的弹出框 事件
    showAddDialog() {
      this.addDialogVisible = true
    },

    // 监听 动态参数,静态参数 弹出框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 点击添加参数的弹出框的 确定按钮 事件
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        // 验证通过,发起网络请求
        const { data: res } = await this.$http.post(`categories/${this.getThreeCascaderId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        // 刷新 当前 对应 tabs 标签下的 table 数据
        this.getParamsData()
        this.addDialogVisible = false
      })
    }
  }

}
</script>

<style lang='less' scoped>
.cat-opt {
  margin: 15px 0;
  span {
    display: inline-block;
    margin-right: 15px;
  }
}
.el-cascader {
  width: 60%;
}
</style>
