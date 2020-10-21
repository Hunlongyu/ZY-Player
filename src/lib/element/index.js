import Vue from 'vue'
import { Message, Button, Table, TableColumn, Tag, Input, Dialog, Form, FormItem, Switch } from 'element-ui'
import Plugin from 'v-fit-columns'
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Switch)
Vue.use(Plugin)
Vue.prototype.$message = Message
