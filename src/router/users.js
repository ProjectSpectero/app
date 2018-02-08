// Authentication routes

import Account from '@/components/users/account'
import Dashboard from '@/components/users/dashboard'

export default [
  { path: '/account', name: 'account', component: Account, meta: { auth: true } },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } }
]
