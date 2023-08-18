import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 7,
  menu: {
    name: t('routes.setting.setting'),
    path: '/setting',
    children: [
      {
        path: 'baseSetting',
        name: t('routes.setting.baseSetting'),
      },
      {
        path: 'mediaNode',
        name: t('routes.setting.mediaNode'),
      },
    ],
  },
}
export default menu
