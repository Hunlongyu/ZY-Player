import Vue from 'vue'
import { Message, Button, Table, TableColumn, Tag, Input, InputNumber, Dialog, Form, FormItem, Switch, Select, Option, Checkbox, Autocomplete, Col, Tree, Divider, Progress, MessageBox } from 'element-ui'
import Plugin from 'v-fit-columns'
import { ButtonGroupPlugin } from 'bootstrap-vue'
Vue.use(ButtonGroupPlugin)
Vue.use(Button)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Switch)
Vue.use(Plugin)
Vue.use(Select)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(Autocomplete)
Vue.use(Tree)
Vue.use(Divider)
Vue.use(Progress)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
