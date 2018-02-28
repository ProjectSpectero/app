import Nodes from '@/components/nodes/list'
import NodeView from '@/components/nodes/edit'

export default [
  { path: '/nodes', name: 'nodes', component: Nodes, meta: { auth: true } },
  { path: '/nodes/:id', name: 'node', component: NodeView, meta: { auth: true } }
]
