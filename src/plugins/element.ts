import Vue from 'vue'
import {
  Container, Row, Col, Header, Aside, Main, Drawer,
  Tabs, TabPane, Button, Select, Option, Pagination,
  Table, TableColumn, Input, Card, Link, Loading,
  Notification, Message, Slider, Popover
} from 'element-ui'

Vue.use(Container)
Vue.use(Row)
Vue.use(Col)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Drawer)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Card)
Vue.use(Link)
Vue.use(Loading)
Vue.use(Slider)
Vue.use(Popover)

Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
