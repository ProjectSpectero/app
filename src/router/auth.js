// Authentication routes

import Login from '@/components/auth/login'

export default [
  { path: '/login', name: 'login', component: Login, meta: { antiAuth: true, layout: 'auth' } }
]
