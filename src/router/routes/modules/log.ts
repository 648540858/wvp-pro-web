import type { AppRouteModule } from '/@/router/types'

import { t } from '/@/hooks/web/useI18n'
import { LAYOUT } from '/@/router/constant'

const dashboard: AppRouteModule = {
  path: '/log',
  name: 'Log',
  component: LAYOUT,
  redirect: '/log/content',
  meta: {
    orderNo: 10,
    icon: 'material-symbols:event-note-outline',
    title: t('routes.log.log'),
  },
  children: [
    {
      path: 'content',
      name: 'LogContent',
      component: () => import('/@/views/log/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.log.log'),
      },
    },
  ],
}

export default dashboard
