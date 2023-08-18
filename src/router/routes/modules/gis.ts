import type { AppRouteModule } from '/@/router/types'

import { t } from '/@/hooks/web/useI18n'
import { LAYOUT } from '/@/router/constant'

const dashboard: AppRouteModule = {
  path: '/gis',
  name: 'Gis',
  component: LAYOUT,
  redirect: '/gis/content',
  meta: {
    orderNo: 10,
    icon: 'gis:location-poi',
    title: t('routes.gis.gis'),
  },
  children: [
    {
      path: 'content',
      name: 'GisContent',
      component: () => import('/@/views/gis/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.gis.gis'),
      },
    },
  ],
}

export default dashboard
