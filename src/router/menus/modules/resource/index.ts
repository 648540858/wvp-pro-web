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
        path: 'gbResource',
        name: t('routes.resource.gbResource'),
      },
      {
        path: 'pushResource',
        name: t('routes.resource.pushResource'),
      },
      {
        path: 'proxyResource',
        name: t('routes.resource.proxyResource'),
      },
    ],
  },
}
export default menu
