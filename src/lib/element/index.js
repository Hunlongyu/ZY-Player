import Vue from 'vue'
import { Message, Table, TableColumn } from 'element-ui'
import Plugin from 'v-fit-columns'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Plugin)
Vue.prototype.$message = Message
