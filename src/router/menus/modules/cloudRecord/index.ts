import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 4,
  menu: {
    name: t('routes.cloudRecord.cloudRecord'),
    path: '/cloudRecord',
  },
}
export default menu
