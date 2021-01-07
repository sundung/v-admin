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
                 @tab-click="tabsActiveClick"
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
                           :options="cateList"
                           :props="cateProps"
                           @change="handleCateChange"
                           clearable></el-cascader>
            </el-form-item>

          </el-tab-pane>

          <!-- 商品参数区域 -->
          <el-tab-pane label="商品参数"
                       name="1">
            <!-- 渲染 商品参数 的 checkbox 区域 -->
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTabsData"
                          :key="item.attr_id">
              <!-- checkbox 区域 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1"
                             border
                             v-for="(item1,index) in item.attr_vals"
                             :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTabsData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload class="upload-demo"
                       :action="uploadPic"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headerObj"
                       :on-success="handleSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览"
               :visible.sync="previewVisbile"
               width="50%">
      <img :src="previewPath"
           alt=""
           class="preview-img">

    </el-dialog>
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
        goods_cat: [],

        // 上传图片的临时路径
        pics: [],

        // 商品介绍详情
        goods_introduce: ''
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
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 动态参数数据
      manyTabsData: [],

      // 静态参数数据,数组
      onlyTabsData: [],

      // 图片上传地址
      uploadPic: 'http://timemeetyou.com:8889/api/private/v1/upload',

      // 图片上传组件的请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 图片预览地址

      previewPath: '',

      // 控制图片预览弹窗的显示与隐藏
      previewVisbile: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    getThreeCateID() {
      // 如果有三级商品分类,则返回其 ID 值,没有返回null
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      // 发起网络请求
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.$message.success('获取商品分类数据成功')
      this.cateList = res.data
      console.log(this.cateList)
    },

    // 商品分类,级联选择器的 change 事件
    handleCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.error('只能选择三级分类')
      }
    },

    // 离开Tabs 触发的钩子 进入的tabs -> activeName , 离开的tabs -> oldActiveName
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },

    // 点击对应的tabs 触发的事件
    async tabsActiveClick() {
      //  active 为 1 证明访问的事 动态参数
      if (this.active === '1') {
        // 发起网络请求
        const { data: res } = await this.$http.get(`categories/${this.getThreeCateID}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        // 处理 数据 成一个数组
        res.data.map(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        // 将数据保存到 data中的 manyTabsData
        this.manyTabsData = res.data
        console.log(this.manyTabsData)

        this.$message.success('获取商品参数成功')
      } else if (this.active === '2') {
        // 发起网络请求
        const { data: res } = await this.$http.get(`categories/${this.getThreeCateID}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }

        // 将数据保存到 data中的 onlyTabsData
        this.onlyTabsData = res.data
        this.$message.success('获取商品属性成功')
      }
    },

    // 图片预览处理事件
    handlePreview(file) {
      // 1.获取到图片的上传地址
      this.previewPath = file.response.data.url
      this.previewVisbile = true
    },

    // 图片删除事件
    handleRemove(file) {
      // 1.获取到图片的上传临时地址
      const filePath = file.response.data.tmp_path
      // 2.从 addForm 中的 pics 数组中查到 当前图片
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.从 pics数组中删除对应的图片
      this.addForm.pics.splice(index, 1)
    },

    // 图片上传成功的钩子函数
    handleSuccess(res) {
      // 获取图片上传的临时地址
      const picInfo = { pic: res.data.tmp_path }
      // 添加到 data 中的 addForm
      this.addForm.pics.push(picInfo)
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
.el-cascader {
  width: 100%;
}
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
// 预览图片的宽度
.preview-img {
  width: 100%;
}
</style>
