import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 1,
  menu: {
    name: t('routes.controlBoard.controlBoard'),
    path: '/control-board',
    children: [
      {
        path: 'overview',
        name: t('routes.controlBoard.overview'),
      },
      {
        path: 'operation-control',
        name: t('routes.controlBoard.operationControl'),
      },
      {
        path: 'access-statistics',
        name: t('routes.controlBoard.accessStatistics'),
      },
    ],
  },
}
export default menu
