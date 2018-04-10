// Authentication routes

import Login from '@/components/app/auth/login'
import TwoFactorLogin from '@/components/app/auth/tfa'
import Register from '@/components/app/auth/register'
import Pending from '@/components/app/auth/pending'
import Verify from '@/components/app/auth/verify'

export default [
  { path: '/login', name: 'login', component: Login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: TwoFactorLogin, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/register', name: 'register', component: Register, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/pending', name: 'pending', component: Pending, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/verify/:email/:token', name: 'verify', component: Verify, meta: { antiAuth: true, layout: 'auth' } }
]
