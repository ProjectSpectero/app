// Default routes

import downloads from '@/app/components/misc/downloads'
import docs from '@/shared/components/docs/index'
import ui from '@/app/components/ui'

export default [
  { path: '/downloads', name: 'downloads', component: downloads, meta: { auth: true } },
  { path: '/docs', name: 'docs', component: docs, meta: { auth: true } },
  { path: '/ui', name: 'ui', component: ui, meta: { auth: true } }
]
