// Authentication routes

import login from '@/app/components/auth/login'
import twoFactorLogin from '@/app/components/auth/tfa'
import register from '@/app/components/auth/register'
import welcome from '@/app/components/auth/welcome'
import verify from '@/app/components/auth/verify'
import reset from '@/app/components/auth/reset'
import newPassword from '@/app/components/auth/newPassword'

export default [
  { path: '/login', name: 'login', component: login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/ask-for-reset', name: 'resetPassword', component: reset, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/password-reset/:token', name: 'newPassword', component: newPassword, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: twoFactorLogin, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/register', name: 'register', component: register, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/welcome', name: 'welcome', component: welcome, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/verify/:email/:token', name: 'verify', component: verify, meta: { antiAuth: true, layout: 'auth' } }
]
