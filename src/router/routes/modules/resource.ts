import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/resource',
  name: 'Resource',
  component: LAYOUT,
  meta: {
    orderNo: 10,
    icon: 'carbon:software-resource-cluster',
    title: t('routes.resource.group'),
  },
  children: [
    {
      path: 'channel',
      name: 'Channel',
      component: () => import('/src/views/resource/channel/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.channel'),
      },
    },
    {
      path: 'group',
      name: 'Group',
      component: () => import('/src/views/resource/group/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.group'),
      },
    },
    {
      path: 'region',
      name: 'Region',
      component: () => import('/src/views/resource/region/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.region'),
      },
    },
    {
      path: 'gb28181',
      name: 'GB28181',
      component: () => import('/@/views/resource/gbResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.gb28181'),
      },
      children: [
        {
          path: 'channel',
          name: 'Channel',
          component: () => import('/@/views/resource/gbResource/channelList/index.vue'),
          meta: {
            // affix: true,
            title: t('routes.resource.gb28181'),
          },
        },
        {
          path: 'record/device',
          name: 'Channel',
          component: () => import('/@/views/resource/gbResource/deviceRecord/index.vue'),
          meta: {
            // affix: true,
            title: t('routes.resource.gb28181'),
          },
        },
      ],
    },
    {
      path: 'push-resource',
      name: 'PushResource',
      component: () => import('/@/views/resource/pushResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.push'),
      },
    },
    {
      path: 'proxy-resource',
      name: 'ProxyResource',
      component: () => import('/@/views/resource/proxyResource/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.resource.proxy'),
      },
    },
  ],
}

export default dashboard
