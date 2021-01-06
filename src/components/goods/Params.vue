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
          <el-button type="
                     primary"
                     :disabled="isBtnDisabled"
                     size="mini">动态参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <!-- 添加静态属性的按钮 -->
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     size="mini">静态属性</el-button>
        </el-tab-pane>

      </el-tabs>
    </el-card>
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
      activeName: 'many'
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
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败')
      }
      this.ccateList = res.data
      console.log(this.ccateList)
    },
    // 级联选择器的change 事件
    async  handleCateChange() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        return
      }
      // 证明所选择的是 三级级联选择器
      // 根据所选的分类 id 和 面板参数(many,only) 来获取 动态参数,和 静态参数 数据
      // const { data: res } = await this.$http.get(`categories/${this.getThreeCascaderId}/attributes`, {
      //   params: { sel: this.activeName }
      // })
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

      console.log(res.data)
    },

    // 点击tabs 页签 触发的事件
    handleClickTabs() {
      console.log(this.activeName)
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
