// Authentication routes

import login from '@/app/views/auth/login'
import twoFactorLogin from '@/app/views/auth/tfa'
import register from '@/app/views/auth/register'
import welcome from '@/app/views/auth/welcome'
import verify from '@/app/views/auth/verify'
import reset from '@/app/views/auth/reset'
import newPassword from '@/app/views/auth/newPassword'

export default [
  { path: '/login', name: 'login', component: login, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/reset', name: 'resetPassword', component: reset, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/password-reset/:token', name: 'newPassword', component: newPassword, meta: { layout: 'auth' } },
  { path: '/tfa', name: 'tfa', component: twoFactorLogin, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/register', name: 'register', component: register, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/welcome', name: 'welcome', component: welcome, meta: { antiAuth: true, layout: 'auth' } },
  { path: '/verify/:email/:token', name: 'verify', component: verify, meta: { antiAuth: true, layout: 'auth' } }
]
