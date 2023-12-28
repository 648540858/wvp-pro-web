import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/live',
  name: 'LIVE',
  component: LAYOUT,
  redirect: '/live/content',
  meta: {
    orderNo: 10,
    icon: 'icon-park-outline:grid-nine',
    component: () => import('/@/views/realTimeVideo/index.vue'),
    title: t('routes.realTimeVideo'),
  },
  children: [
    {
      path: 'content',
      name: 'RealTimeVideoContent',
      component: () => import('/@/views/realTimeVideo/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.realTimeVideo.realTimeVideo'),
      },
    },
  ],
}

export default dashboard
