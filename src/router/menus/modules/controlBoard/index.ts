import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 1,
  menu: {
    name: t('routes.controlBoard.controlBoard'),
    path: '/controlBoard',
    children: [
      {
        path: 'overview',
        name: t('routes.controlBoard.overview'),
      },
      {
        path: 'operationControl',
        name: t('routes.controlBoard.operationControl'),
      },
      {
        path: 'accessStatistics',
        name: t('routes.controlBoard.accessStatistics'),
      },
    ],
  },
}
export default menu
