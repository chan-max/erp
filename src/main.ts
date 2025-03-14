import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import '/@/design/index.less'
import 'virtual:windi-utilities.css'
// Register icon sprite
import 'virtual:svg-icons-register'
import App from './App.vue'
import { createApp } from 'vue'
import { initAppConfigStore } from '/@/logics/initAppConfig'
import { router, setupRouter } from '/@/router'
import { setupRouterGuard } from '/@/router/guard'
import { setupStore } from '/@/store'
import { setupGlobDirectives } from '/@/directives'
import { setupI18n } from '/@/locales/setupI18n'
import { registerGlobComp } from '/@/components/registerGlobComp'
import Antd from 'ant-design-vue'
import { isDevMode } from './utils/env'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '/@/design/table.less'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import vPreviewImage from '/@/components/PreviewImage/index'


// import 'ant-design-vue/es/style'
import 'ant-design-vue/dist/antd.css';
if (isDevMode()) {
  import('ant-design-vue/es/style')
}

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  // 配置 store
  setupStore(app)

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore()

  // Register global components
  // 注册全局组件
  registerGlobComp(app)

  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app)

  // Configure routing
  // 配置路由
  setupRouter(app)

  // router-guard
  // 路由守卫
  setupRouterGuard(router)

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app)

  // Configure global error handling

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  app.use(Antd).use(VxeUI).use(VxeUITable)
  app.use(ElementPlus)

  app.use(VueViewer)

  app.use(vPreviewImage)

  app.mount('#app')
}

bootstrap()
