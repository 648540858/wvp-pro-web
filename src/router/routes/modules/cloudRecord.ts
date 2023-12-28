import type { AppRouteModule } from '/@/router/types'

import { t } from '/@/hooks/web/useI18n'
import { LAYOUT } from '/@/router/constant'

const dashboard: AppRouteModule = {
  path: '/cloud-record',
  name: 'CloudRecord',
  component: LAYOUT,
  redirect: '/cloud-record/content',
  meta: {
    orderNo: 10,
    icon: 'streamline:interface-weather-cloud-1-cloud-meteorology-cloudy-overcast-cover-weather',
    title: t('routes.cloudRecord.cloudRecord'),
  },
  children: [
    {
      path: 'content',
      name: 'CloudRecordContent',
      component: () => import('/@/views/cloudRecord/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.cloudRecord.cloudRecord'),
      },
    },
  ],
}

export default dashboard
