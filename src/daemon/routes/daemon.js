import manage from '@/daemon/components/manage/manage'
import HTTPProxy from '@/daemon/components/services/HTTPProxy/edit'
import openVPN from '@/daemon/components/services/openVPN/edit'
import services from '@/daemon/components/services/services'
import users from '@/daemon/components/users/list'
import certificates from '@/daemon/components/users/certificates'

export default [
  { path: '/daemon/:nodeId', name: 'daemon', component: manage, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services', name: 'daemon-services', component: services, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/HTTPProxy/edit', name: 'daemon-service-HTTPProxy', component: HTTPProxy, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/openVPN/edit', name: 'daemon-service-OpenVPN', component: openVPN, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users', name: 'daemon-users', component: users, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/users/:id/certificates', name: 'daemon-user-certificates', component: certificates, meta: { auth: true, layout: 'daemon' } }
]
