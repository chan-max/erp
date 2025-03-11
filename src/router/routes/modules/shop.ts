import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'
import WorkInProgress from '/@/components/WorkInProgress.vue'


const order: AppRouteModule = {
  path: '/shop',
  name: 'Shop',
  component: LAYOUT,
  redirect: '/shop/shop',
  meta: {  
    orderNo: 10,
    icon: 'lets-icons:shop',
    title: '店铺管理',
  },
  children: [
    {
      path: 'list',
      name: 'ShopList',
      component: WorkInProgress,
      meta: {
        // affix: true,
        title: '店铺管理',
      },
    },
    {
        path: 'goods',
        name: 'Goods',
        component: WorkInProgress,
        meta: {
          // affix: true,
          title: '商品管理',
        },
      },
      {
        path: 'group',
        name: 'Group',
        component: WorkInProgress,
        meta: {
          // affix: true,
          title: '店铺管理',
        },
      },
  ],
}

export default order
