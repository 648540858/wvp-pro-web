import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 7,
  menu: {
    name: t('routes.setting.setting'),
    path: '/setting',
    children: [
      {
        path: 'base',
        name: t('routes.setting.base'),
      },
      {
        path: 'media-node',
        name: t('routes.setting.mediaNode'),
      },
    ],
  },
}
export default menu
