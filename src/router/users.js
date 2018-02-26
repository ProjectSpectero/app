// Authentication routes

import Settings from '@/components/users/settings'
import Dashboard from '@/components/users/dashboard'

export default [
  { path: '/user/settings', name: 'settings', component: Settings, meta: { auth: true } },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } }
]
