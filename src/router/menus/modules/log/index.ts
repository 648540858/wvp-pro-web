import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 5,
  menu: {
    name: t('routes.log.log'),
    path: '/log',
  },
}
export default menu
