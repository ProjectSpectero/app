import nodes from '@/components/app/nodes/nodes'
import node from '@/components/app/nodes/node'
import groupEdit from '@/components/app/nodes/groupEdit'

export default [
  { path: '/nodes', name: 'nodes', component: nodes, meta: { auth: true } },
  { path: '/nodes/group/:id', name: 'nodesByGroup', component: nodes, meta: { auth: true } },
  { path: '/node/:action/:id', name: 'node', component: node, meta: { auth: true } },
  { path: '/group/edit/:id', name: 'groupEdit', component: groupEdit, meta: { auth: true } }
]
