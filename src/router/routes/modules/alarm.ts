import type { AppRouteModule } from '/@/router/types'

import { t } from '/@/hooks/web/useI18n'
import { LAYOUT } from '/@/router/constant'

const dashboard: AppRouteModule = {
  path: '/alarm',
  name: 'Alarm',
  component: LAYOUT,
  redirect: '/alarm/content',
  meta: {
    orderNo: 10,
    icon: 'ri:alarm-warning-fill',
    title: t('routes.alarm.alarm'),
  },
  children: [
    {
      path: 'content',
      name: 'AlarmContent',
      component: () => import('/@/views/alarm/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.alarm.alarm'),
      },
    },
  ],
}

export default dashboard
