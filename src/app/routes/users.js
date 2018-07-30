import dashboard from '@/app/components/users/dashboard'
import usersList from '@/app/components/users/list'
import settings from '@/app/components/settings/settings'

export default [
  { path: '/', name: 'dashboard', component: dashboard, meta: { auth: true } },
  { path: '/users/list/:page?', name: 'users-list', component: usersList, meta: { auth: true } },
  { path: '/settings/:tab?/:fromInvoice?', name: 'settings', component: settings, meta: { auth: true } }
]
