// Default routes

import downloads from '@/app/components/misc/downloads'
import docs from '@/app/components/docs'
import ui from '@/app/components/ui'

export default [
  { path: '/downloads', name: 'downloads', component: downloads },
  { path: '/docs', name: 'docs', component: docs },
  { path: '/ui', name: 'ui', component: ui }
]
