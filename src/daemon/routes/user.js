import daemon from '@/daemon/components/users/dashboard'
import certificates from '@/daemon/components/users/certificates'

export default [
  { path: '/daemon/:nodeId', name: 'daemon', component: daemon, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/certificates', name: 'certificates', component: certificates, meta: { auth: true, layout: 'daemon' } }
]
