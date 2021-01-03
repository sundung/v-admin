<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-text">电商管理后台</div>
      <el-button type="info" @click="handleOut">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 页面侧边栏区域 -->
      <el-aside :width="isCollaspe ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#2d3f55"
          text-color="#fff"
          active-text-color="red"
          unique-opened
          :collapse="isCollaspe"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 循环设置一级菜单的图标 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 菜单数据
      menuList: [],
      // 一级菜单 icon
      iconsObj: {
        125: 'el-icon-user',
        103: 'el-icon-goods',
        101: 'el-icon-help',
        102: 'el-icon-s-order',
        145: 'el-icon-s-opportunity'
      },
      // 控制 菜单栏的折叠与展开
      isCollaspe: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出操作
    handleOut() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击折叠按钮,控制菜单的折叠与展开
    toggleCollapse() {
      this.isCollaspe = !this.isCollaspe
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #3e8fbc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-text {
    font-size: 36px;
    color: #fff;
  }
}
.el-aside {
  background-color: #2d3f55;
  // 优化 el-menu 的 1px 像素问题
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #f1f3f5;
}
// 折叠按钮样式
.toggle-button {
  background-color: #545c6f;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 0.3em;
}
</style>
