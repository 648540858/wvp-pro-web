import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 3,
  menu: {
    name: t('routes.gis.gis'),
    path: '/gis',
  },
}
export default menu
