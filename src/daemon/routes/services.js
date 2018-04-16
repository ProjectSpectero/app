import Proxies from '@/daemon/components/services/proxies'
import ServicesList from '@/daemon/components/services/services'
import HTTPProxy from '@/daemon/components/services/HTTPProxy/edit'

export default [
  { path: '/daemon/:nodeId/proxies', name: 'proxies', component: Proxies, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services', name: 'services', component: ServicesList, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/httpproxy/edit', name: 'HTTPProxy', component: HTTPProxy, meta: { auth: true, layout: 'daemon' } }
]
