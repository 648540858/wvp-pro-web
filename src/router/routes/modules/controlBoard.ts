import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/controlBoard',
  name: 'ControlBoard',
  component: LAYOUT,
  redirect: '/controlBoard/operationControl',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.controlBoard.operationControl'),
  },
  children: [
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
