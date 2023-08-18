import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 9,
  menu: {
    name: t('routes.about.about'),
    path: '/about',
  },
}
export default menu
