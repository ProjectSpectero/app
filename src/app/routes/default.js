// Default routes

import downloads from '@/app/components/misc/downloads'
import help from '@/app/components/help/index'
import ui from '@/app/components/ui'

export default [
  { path: '/downloads', name: 'downloads', component: downloads },
  { path: '/help', name: 'help', component: help },
  { path: '/ui', name: 'ui', component: ui }
]
