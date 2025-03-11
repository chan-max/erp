import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'
import WorkInProgress from '/@/components/WorkInProgress.vue'


const user: AppRouteModule = {
  path: '/user',
  name: 'User',
  component: LAYOUT,
  redirect: '/user/list',
  meta: {  
    orderNo: 10,
    icon: 'tabler:user-filled',
    title: '用户管理',
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('/@/views/user/user/index.vue'),
      meta: {
        // affix: true,
        title: '用户管理',
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: WorkInProgress,
      meta: {
        title: '角色管理',
      },
    },
  ],
}

export default user
