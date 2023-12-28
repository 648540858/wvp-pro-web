import type { MenuModule } from '/@/router/types'
import { t } from '/@/hooks/web/useI18n'
const menu: MenuModule = {
  orderNo: 5,
  menu: {
    name: t('routes.resource.resource'),
    path: '/resource',

    children: [
      {
        path: 'channel',
        name: t('routes.resource.channel'),
      },
      {
        path: 'group',
        name: t('routes.resource.group'),
      },
      {
        path: 'region',
        name: t('routes.resource.region'),
      },
      {
        path: 'gb28181',
        name: t('routes.resource.gb28181'),
      },
      {
        path: 'push',
        name: t('routes.resource.push'),
      },
      {
        path: 'proxy',
        name: t('routes.resource.proxy'),
      },
    ],
  },
}
export default menu
