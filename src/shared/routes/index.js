// Shared routes

import error404 from '@/shared/components/404'

export default [
  { path: '*', name: 'error404', component: error404, meta: { layout: 'error' } }
]
