import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 6,
  menu: {
    name: t('routes.gbPlatform.gbPlatform'),
    path: '/gbPlatform',
  },
}
export default menu
