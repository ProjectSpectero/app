import Daemon from '@/daemon/components/users/dashboard'
import UsersList from '@/daemon/components/users/list'
import UsersCreate from '@/daemon/components/users/create'
import UsersEdit from '@/daemon/components/users/edit'

export default [
  { path: '/daemon/:nodeId', name: 'daemon', component: Daemon, meta: { auth: true, layout: 'daemon' } },
  { path: '/users', name: 'users', component: UsersList, meta: { auth: true, layout: 'daemon' } },
  { path: '/users/add', name: 'userCreate', component: UsersCreate, meta: { auth: true, layout: 'daemon' } },
  { path: '/users/edit/:id', name: 'userEdit', component: UsersEdit, meta: { auth: true, layout: 'daemon' } }
]
