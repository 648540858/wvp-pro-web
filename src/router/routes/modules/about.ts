import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const about: AppRouteModule = {
  path: '/about',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/content',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:aboutdotme',
    title: t('routes.about.about'),
    orderNo: 100000,
  },
  children: [
    {
      path: 'about',
      name: 'About',
      component: () => import('/@/views/about/index.vue'),
      meta: {
        title: t('routes.about.about'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
}

export default about
