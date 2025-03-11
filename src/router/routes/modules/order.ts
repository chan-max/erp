import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'
import WorkInProgress from '/@/components/WorkInProgress.vue'


const order: AppRouteModule = {
  path: '/order',
  name: 'Order',
  component: LAYOUT,
  redirect: '/order/order',
  meta: {  
    orderNo: 10,
    icon: 'material-symbols:order-play-sharp',
    title: '订单管理',
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('/@/views/feature/order/index.vue'),
      meta: {
        // affix: true,
        title: '订单管理',
      },
    },
  ],
}

export default order
