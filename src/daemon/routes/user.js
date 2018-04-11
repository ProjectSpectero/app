import UsersList from '@/daemon/components/users/list'
import UsersCreate from '@/daemon/components/users/create'
import UsersEdit from '@/daemon/components/users/edit'

export default [
  { path: '/users', name: 'users', component: UsersList, meta: { auth: true } },
  { path: '/users/add', name: 'userCreate', component: UsersCreate, meta: { auth: true } },
  { path: '/users/edit/:id', name: 'userEdit', component: UsersEdit, meta: { auth: true } }
]
