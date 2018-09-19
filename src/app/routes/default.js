// Default routes

import downloads from '@/app/views/misc/downloads'

export default [
  { path: '/downloads', name: 'downloads', component: downloads, meta: { auth: false } }
]
