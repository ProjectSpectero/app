import manage from '@/daemon/views/manage/manage'
import HTTPProxy from '@/daemon/views/services/HTTPProxy/edit'
import openVPN from '@/daemon/views/services/openVPN/edit'
import services from '@/daemon/views/services/services'
import users from '@/daemon/views/users/list'
import certificates from '@/daemon/views/users/certificates'
import resources from '@/daemon/views/users/resources'
import edit from '@/daemon/views/users/edit'
import create from '@/daemon/views/users/create'

export default [
  { path: '/daemon/:nodeId', name: 'daemon', component: manage, meta: { layout: 'daemon' } },
  { path: '/daemon/:nodeId/services', name: 'daemon-services', component: services, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/HTTPProxy/edit', name: 'daemon-service-HTTPProxy', component: HTTPProxy, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/openVPN/edit', name: 'daemon-service-OpenVPN', component: openVPN, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users', name: 'daemon-users', component: users, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users/create', name: 'daemon-user-create', component: create, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users/:id', name: 'daemon-user-edit', component: edit, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users/:id/certificates', name: 'daemon-user-certificates', component: certificates, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users/:id/resources', name: 'daemon-user-resources', component: resources, meta: { auth: true, layout: 'daemon' } }
]
