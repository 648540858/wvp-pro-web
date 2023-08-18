import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/resource',
  name: 'Resource',
  component: LAYOUT,
  redirect: '/resource/integration',
  meta: {
    orderNo: 10,
    icon: 'carbon:software-resource-cluster',
    title: t('routes.resource.resource'),
  },
  children: [
    {
      path: 'integration',
      name: 'Integration',
      component: () => import('/@/views/resource/integration/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.integration'),
      },
    },
    {
      path: 'gbResource',
      name: 'GBResource',
      component: () => import('/@/views/resource/gbResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.gbResource'),
      },
    },
    {
      path: 'pushResource',
      name: 'PushResource',
      component: () => import('/@/views/resource/pushResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.pushResource'),
      },
    },
    {
      path: 'proxyResource',
      name: 'ProxyResource',
      component: () => import('/@/views/resource/proxyResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.proxyResource'),
      },
    },
  ],
}

export default dashboard
