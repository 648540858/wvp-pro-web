import type { AppRouteModule } from '/@/router/types'

import { t } from '/@/hooks/web/useI18n'
import { LAYOUT } from '/@/router/constant'

const dashboard: AppRouteModule = {
  path: '/gbPlatform',
  name: 'GBPlatform',
  component: LAYOUT,
  redirect: '/gbPlatform/content',
  meta: {
    orderNo: 10,
    icon: 'streamline:interface-hierarchy-2-node-organization-links-structure-link-nodes-network-hierarchy',
    title: t('routes.gbPlatform.gbPlatform'),
  },
  children: [
    {
      path: 'content',
      name: 'GBPlatformContent',
      component: () => import('/@/views/gbPlatform/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.gbPlatform.gbPlatform'),
      },
    },
  ],
}

export default dashboard
