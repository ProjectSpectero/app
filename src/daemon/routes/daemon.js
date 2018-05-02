import manage from '@/daemon/components/manage/manage'

export default [
  { path: '/daemon/:nodeId/:action?', name: 'manage', component: manage, meta: { auth: true, layout: 'daemon' } }
]
