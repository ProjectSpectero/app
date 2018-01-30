// Default routes: error pages, catch-all ...

import error404 from '@/components/errors/404'
import ui from '@/components/ui'

export default [
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } },
  { path: '/ui', name: 'ui', component: ui }
]
