import Dashboard from '@/app/components/users/dashboard'
import Settings from '@/app/components/settings/settings'

export default [
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } },
  { path: '/settings/:tab?/:fromInvoice?', name: 'settings', component: Settings, meta: { auth: true } }
]
