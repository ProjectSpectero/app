// Authentication routes

import Login from '@/components/auth/login'
import TwoFactorLogin from '@/components/auth/tfa'
import Register from '@/components/auth/register'
import Verify from '@/components/auth/verify'

export default [
  { path: '/login', name: 'login', component: Login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: TwoFactorLogin, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/register', name: 'register', component: Register, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/verify', name: 'verify', component: Verify, meta: { antiAuth: true, layout: 'auth' } }
]
