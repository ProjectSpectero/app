// Shared routes

import error404 from '@/shared/components/404'
import docs from '@/shared/views/docs/index'

export default [
  { path: '/docs', name: 'docs', component: docs, meta: { auth: true } },
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } }
]
