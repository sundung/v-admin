import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)

// 全局挂载 message 组件
Vue.prototype.$message = Message
