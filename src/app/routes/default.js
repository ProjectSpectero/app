// Default routes

import downloads from '@/app/views/misc/downloads'
import ui from '@/app/views/ui'

export default [
  { path: '/downloads', name: 'downloads', component: downloads, meta: { auth: false } },
  { path: '/ui', name: 'ui', component: ui, meta: { auth: true } }
]
