// Default routes: error pages, catch-all ...

import error404 from '@/app/components/errors/404'
import downloads from '@/app/components/misc/downloads'
import ui from '@/app/components/ui'

export default [
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } },
  { path: '/downloads', name: 'downloads', component: downloads },
  { path: '/ui', name: 'ui', component: ui }
]
