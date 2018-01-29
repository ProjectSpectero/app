// Authentication routes

import Login from '@/components/auth/login'
import TwoFactorLogin from '@/components/auth/tfa'

export default [
  { path: '/login', name: 'login', component: Login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: TwoFactorLogin, meta: { antiAuth: true, layout: 'auth' } }
]
