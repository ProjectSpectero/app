// Shared routes

import error404 from '@/shared/components/404'
import docs from '@/shared/views/docs/index'
import apiError from '@/shared/views/apiError'
import appError from '@/shared/views/appError'

export default [
  { path: '/docs', name: 'docs', component: docs, meta: { auth: true } },
  { path: '/error/api', name: 'api-error', component: apiError, meta: { auth: false } },
  { path: '/error/app', name: 'app-error', component: appError, meta: { auth: false } },
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } }
]
