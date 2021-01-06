<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200"
                :active="active - 0"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="ruleFormRef"
               label-position="top"
               label-width="100px">
        <!-- tabs区域 -->
        <el-tabs v-model="active"
                 :before-leave="beforeTabsLeave"
                 :tab-position="'left'">
          <el-tab-pane label="基本信息"
                       name="0">
            <!-- 基本信息 tabs 页签中的 表单 -->
            <!-- 商品名称 --------------------------->
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格表单区域-------------------------- -->
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input type="number"
                        v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <!--商品重量表单区域---------------- ---->
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input type="number"
                        v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!-- 商品数量表单区域--------------------- -->
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input type="number"
                        v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 商品分类表单区域--------------------- -->
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader v-model="addForm.goods_cat"
                           expand-trigger="hover"
                           :options="cateList"
                           :props="cateProps"
                           @change="handleCateChange"
                           clearable></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {

      // 步骤条的 表明步骤的 index，从 0 开始
      active: '0',

      // 添加商品表单绑定的对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择器,所选择的商品分类,所组成的数组
        goods_cat: []
      },

      // 添加商品表单绑定的验证规则对象
      addFormRules: {
        goods_name: [
          {
            required: true, message: '请输入商品名称', trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true, message: '请输入商品价格', trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true, message: '请输入商品数量', trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true, message: '请输入商品分类', trigger: 'blur'
          }
        ]

      },

      // 商品分类
      cateList: [],

      // 商品分类级联选择器,所绑定的 prop属性对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // 发起网络请求
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      console.log(res.data)
      this.$message.success('获取商品分类数据成功')
      this.cateList = res.data
    },

    // 商品分类,级联选择器的 change 事件
    handleCateChange() {

    },

    // 离开Tabs 触发的钩子 进入的tabs -> activeName , 离开的tabs -> oldActiveName
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 12px !important;
}
</style>
