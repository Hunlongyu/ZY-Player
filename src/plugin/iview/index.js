import Vue from 'vue'
import 'view-design/dist/styles/iview.css'
import {
  Layout, Sider, Header, Content, Row, Col,
  Icon, Button, Input, Select, Option, Table,
  Message, Notice, Page
} from 'view-design'

Vue.component('Layout', Layout)
Vue.component('Sider', Sider)
Vue.component('Header', Header)
Vue.component('Content', Content)
Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Icon', Icon)
Vue.component('Button', Button)
Vue.component('Input', Input)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Table', Table)
Vue.component('Page', Page)

Vue.prototype.$Message = Message
Vue.prototype.$Notice = Notice
Vue.prototype.$Notice.config({
  top: 60
})
