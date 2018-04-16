// Authentication routes

import Login from '@/app/components/auth/login'
import TwoFactorLogin from '@/app/components/auth/tfa'
import Register from '@/app/components/auth/register'
import Pending from '@/app/components/auth/pending'
import Verify from '@/app/components/auth/verify'

export default [
  { path: '/login', name: 'login', component: Login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: TwoFactorLogin, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/register', name: 'register', component: Register, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/pending', name: 'pending', component: Pending, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/verify/:email/:token', name: 'verify', component: Verify, meta: { antiAuth: true, layout: 'auth' } }
]
