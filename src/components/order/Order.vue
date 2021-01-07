<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
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
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
