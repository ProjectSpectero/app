import nodes from '@/components/nodes/nodes'
import node from '@/components/nodes/node'
import nodeGroupView from '@/components/nodes/groupEdit'

export default [
  { path: '/nodes', name: 'nodes', component: nodes, meta: { auth: true } },
  { path: '/nodes/group/:id', name: 'nodesByGroup', component: nodes, meta: { auth: true } },
  { path: '/node/:action/:id', name: 'node', component: node, meta: { auth: true } },
  { path: '/group/:id', name: 'group', component: nodeGroupView, meta: { auth: true } }
]
