import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录页面
import Login from '../components/Login.vue'
// 导入首页
import Home from '../views/Home.vue'
// 导入欢迎页面
import Welcome from '../components/Welcome.vue'
// 导入用户列表页面
import Users from '../components//user/Users.vue'
// 导入权限列表页面
import Rights from '../components//power/Rights.vue'
// 导入角色列表页面
import Roles from '../components//power/Roles.vue'
// 导入商品分类列表页面
import Cate from '../components//goods/Cate.vue'
// 导入商品管理下的分类列表页面
import Params from '../components//goods/Params.vue'
// 导入商品管理下的商品列表页面
import List from '../components//goods/List.vue'
// 导入添加商品页面
import AddGoods from '../components//goods/AddGoods.vue'
// 导入订单管理页面
import Order from '../components/order/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    // home 的 嵌套子路由 Welcome
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫(前置守卫)

router.beforeEach((to, from, next) => {
  // to 将要跳转的路由
  // from 从哪里来的路由
  // next next是一个函数,表示放行
  //    next() 放行, next('/login) 强制跳转

  // 判断当前路由地址
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有 token 强制跳转到登录页面
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
