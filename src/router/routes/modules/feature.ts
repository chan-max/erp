import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'
import WorkInProgress from '/@/components/WorkInProgress.vue'

const feature: AppRouteModule = {
  path: '/feature',
  name: 'Feature',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ep:menu',
    title: '功能模块',
  },
  children: [
    {
      path: 'material',
      name: 'Material',
      meta: {
        // affix: true,
        title: '素材管理',
      },
      component: () => import('/@/views/feature/material/index.vue'),
      children:[
        {
          path: 'collect',
          name: 'MaterialCollect',
          // component: WorkInProgress,
          component: () => import('/@/views/feature/collect/index.vue'),
          meta: {
            // affix: true,
            title: '数据采集',
          },
        },
        {
          path: 'all',
          name: 'MaterialAll',
          component: () => import('/@/views/feature/material/index.vue'),
          meta: {
            // affix: true,
            title: '素材库',
          },
        },
        {
          path: 'classify',
          name: 'Classify',
          component: () => import('/@/views/feature/classify/index.vue'),
          meta: {
            // affix: true,
            title: '分类管理',
          },
        },
        {
          path: 'tag',
          name: 'Tag',
          component: () => import('/@/views/feature/tag/index.vue'),
          meta: {
            // affix: true,
            title: '标签管理',
          },
        },
      ]
    },
    {
      path: 'product',
      name: 'Product',
      component: () => import('/@/views/feature/product/index.vue'),
      meta: {
        // affix: true,
        title: '套图管理',
      },
    },

    // {
    //   path: 'crawler-picture',
    //   name: 'CrawlerPicture',
    //   component: () => import('/@/views/feature/crawler/index.vue'),
    //   meta: {
    //     // affix: true,
    //     title: '网络爬图',
    //   },
    // },
    {
      path: 'title',
      name: 'GenerateTitle',
      component: () => import('/@/views/feature/title/index.vue'),
      meta: {
        // affix: true,
        title: '生成标题',
      },
    },
    {
      path: 'ps',
      name: 'Ps',
      component: () => import('/@/views/feature/ps/index.vue'),
      meta: {
        title: 'PS套图',
      },
    },
    {
      path: 'publish',
      name: 'Publish',
      component: () => import('/@/views/feature/publish/index.vue'),
      meta: {
        title: '上传发布',
      },
    },
  ],
}

export default feature
