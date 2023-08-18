import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/setting',
  name: 'Setting',
  component: LAYOUT,
  redirect: '/setting/baseSetting',
  meta: {
    orderNo: 10,
    icon: 'iconamoon:settings',
    title: t('routes.setting.setting'),
  },
  children: [
    {
      path: 'baseSetting',
      name: 'BaseSetting',
      component: () => import('/@/views/setting/baseSetting/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.setting.baseSetting'),
      },
    },
    {
      path: 'mediaNode',
      name: 'MediaNode',
      component: () => import('/@/views/setting/mediaNode/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.setting.mediaNode'),
      },
    },
  ],
}

export default dashboard
