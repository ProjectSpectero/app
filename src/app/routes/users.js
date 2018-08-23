import dashboard from '@/app/views/users/dashboard'
import usersList from '@/app/views/users/list'
import settings from '@/app/views/users/settings'

export default [
  { path: '/', name: 'dashboard', component: dashboard, meta: { auth: true } },
  { path: '/users/list/:page?', name: 'users-list', component: usersList, meta: { auth: true } },
  { path: '/settings/:tab?', name: 'settings', component: settings, meta: { auth: true } }
]
