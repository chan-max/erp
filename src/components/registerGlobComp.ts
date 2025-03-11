import type { App } from 'vue'
import { Button } from './Button'
import { Input, Layout } from 'ant-design-vue'
import formItem from './Erp/formItem.vue'


export function registerGlobComp(app: App) {

  app.component('formItem',formItem)

  app.use(Input).use(Button).use(Layout)
}
