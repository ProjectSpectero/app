// Shared routes

import error404 from '@/shared/components/404'
import docs from '@/shared/views/docs/index'
import error from '@/shared/views/appError'

export default [
  { path: '/docs', name: 'docs', component: docs, meta: { auth: true } },
  { path: '/error', name: 'app-error', component: error, meta: { auth: false } },
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } }
]
