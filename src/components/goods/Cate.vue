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
        <el-button type="primary">添加分类</el-button>
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
      ]
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

      console.log(this.cateList)
      console.log(this.total)
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
    }
  }

}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
