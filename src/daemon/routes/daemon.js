import manage from '@/daemon/components/manage/manage'
import HTTPProxy from '@/daemon/components/services/HTTPProxy/edit'
import openVPN from '@/daemon/components/services/openVPN/edit'

export default [
  { path: '/daemon/:nodeId/services/HTTPProxy/edit', name: 'service.HTTPProxy', component: HTTPProxy, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/services/openVPN/edit', name: 'service.OpenVPN', component: openVPN, meta: { auth: true, layout: 'daemon' } },
  { path: '/daemon/:nodeId/:tabAction?', name: 'manage', component: manage, meta: { auth: true, layout: 'daemon' } }
]
