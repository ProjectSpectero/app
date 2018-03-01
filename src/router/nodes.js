import Nodes from '@/components/nodes/list'
import NodeView from '@/components/nodes/edit'
import NodeGroupView from '@/components/nodes/editGroup'

export default [
  { path: '/nodes', name: 'nodes', component: Nodes, meta: { auth: true } },
  { path: '/nodes/:id', name: 'node', component: NodeView, meta: { auth: true } },
  { path: '/groups/:id', name: 'group', component: NodeGroupView, meta: { auth: true } }
]
