// Default routes: error pages, catch-all ...

import error404 from '@/components/app/errors/404'
import downloads from '@/components/app/misc/downloads'
import ui from '@/components/app/ui'

export default [
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } },
  { path: '/downloads', name: 'downloads', component: downloads },
  { path: '/ui', name: 'ui', component: ui }
]
