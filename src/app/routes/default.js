// Default routes

import downloads from '@/app/components/misc/downloads'
import ui from '@/app/components/ui'

export default [
  { path: '/downloads', name: 'downloads', component: downloads },
  { path: '/ui', name: 'ui', component: ui }
]
