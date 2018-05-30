import nodes from '@/app/components/nodes/nodes'
import node from '@/app/components/nodes/node'
import verifyNode from '@/app/components/nodes/verify'
import groupEdit from '@/app/components/nodes/groupEdit'

export default [
  { path: '/nodes', name: 'nodes', component: nodes, meta: { auth: true } },
  { path: '/nodes/group/:id/:page?', name: 'nodesByGroup', component: nodes, meta: { auth: true } },
  { path: '/node/verify/:id', name: 'verifyNode', component: verifyNode, meta: { auth: true } },
  { path: '/node/:action/:id/:tabAction?', name: 'node', component: node, meta: { auth: true } },
  { path: '/group/edit/:id/:tabAction?', name: 'groupEdit', component: groupEdit, meta: { auth: true } }
]
