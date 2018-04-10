import Dashboard from '@/components/app/users/dashboard'
import Settings from '@/components/app/settings/settings'

export default [
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } },
  { path: '/settings/:tab?', name: 'settings', component: Settings, meta: { auth: true } }
]
