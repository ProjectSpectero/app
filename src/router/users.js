// Authentication routes

import Account from '@/components/users/account'

export default [
  { path: '/account', name: 'account', component: Account, meta: { auth: true } }
]
