// User routes

import Dashboard from '@/components/dashboard'
// import UsersList from '@/components/users/list'
// import UsersCreate from '@/components/users/create'
// import UsersEdit from '@/components/users/edit'

export default [
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } }
  // { path: '/users', name: 'users', component: UsersList, meta: { auth: true } },
  // { path: '/users/add', name: 'userCreate', component: UsersCreate, meta: { auth: true } },
  // { path: '/users/edit/:id', name: 'userEdit', component: UsersEdit, meta: { auth: true } }
]
