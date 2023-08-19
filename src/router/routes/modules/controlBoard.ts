import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/controlBoard',
  name: 'ControlBoard',
  component: LAYOUT,
  redirect: '/controlBoard/overview',
  meta: {
    orderNo: 1,
    icon: 'ion:grid-outline',
    title: t('routes.controlBoard.operationControl'),
  },
  children: [
    {
      path: 'overview',
      name: 'Overview',
      component: () => import('/@/views/controlBoard/overview/index.vue'),
      meta: {
        affix: true,
        title: t('routes.controlBoard.overview'),
      },
    },
    {
      path: 'operationControl',
      name: 'OperationControl',
      component: () => import('/@/views/controlBoard/operationControl/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.controlBoard.operationControl'),
      },
    },
    {
      path: 'accessStatistics',
      name: 'AccessStatistics',
      component: () => import('/@/views/controlBoard/accessStatistics/index.vue'),
      meta: {
        title: t('routes.controlBoard.accessStatistics'),
      },
    },
  ],
}

export default dashboard
