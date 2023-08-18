import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.controlBoard.operationControl'),
    path: '/controlBoard',

    children: [
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
