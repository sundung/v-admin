<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表表格 -->
      <el-table :data="ordersList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"
                         width="100px"></el-table-column>
        <el-table-column label="是否付款"
                         width="100px"
                         prop="pay_status">
          <template slot-scope="scope">
            <el-tag type='success'
                    v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type='danger'
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         width="70px"
                         prop="is_send"></el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120px">
          <template>
            <el-button type="primary"
                       @click="showEditAddress"
                       size="mini"
                       icon="el-icon-edit"></el-button>
            <el-button type="success"
                       size="mini"
                       icon="el-icon-location"></el-button>
          </template></el-table-column>
      </el-table>
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
    <!-- 点击修改地址,弹出对话框 -->
    <el-dialog title="提示"
               :visible.sync="addressVisible"
               @close="addressColsed"
               width="60%">
      <!-- 表单信息区域 -->
      <el-form :model="addressForm"
               :rules="addressFormRules"
               ref="addressFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="省市县/区"
                      prop="address1">
          <!-- 级联选择器 -->
          <el-cascader :props="{ expandTrigger: 'hover' }"
                       :options="cityData"
                       v-model="addressForm.address1"
                       @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入 省市县数据
import cityData from './cityData.js'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 查询条件
        query: '',
        // 当前显示页数
        pagenum: 1,
        // 每页显示的条数
        pagesize: 10
      },

      // 订单列表数据
      ordersList: [],

      // 总页数
      total: 0,

      // 控制修改地址的弹出框的显示与隐藏
      addressVisible: false,

      // 修改地址 form 表单的绑定对象
      addressForm: {
        address1: [],
        address2: ''
      },

      // 修改地址 form 表单的验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市县区', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },

      // 省市县数据
      cityData
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {

    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.ordersList = res.data.goods
      this.total = res.data.total
      console.log(this.ordersList)
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 点击修改地址按钮,弹出对话框
    showEditAddress() {
      this.addressVisible = true
    },

    // 省市县级联选择器的change 事件
    handleChange() {

    },

    // 修改地址对话框关闭事件
    addressColsed() {
      this.$refs.addressFormRef.resetFields()
    }
  }
}
</script>

<style>
</style>
