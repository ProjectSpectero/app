import Proxies from '@/daemon/components/services/proxies'
import ServicesList from '@/daemon/components/services/services'
import HTTPProxy from '@/daemon/components/services/HTTPProxy/edit'

export default [
  { path: '/proxies', name: 'proxies', component: Proxies, meta: { auth: true } },
  { path: '/services', name: 'services', component: ServicesList, meta: { auth: true } },
  { path: '/services/httpproxy/edit', name: 'HTTPProxy', component: HTTPProxy, meta: { auth: true } }
]
