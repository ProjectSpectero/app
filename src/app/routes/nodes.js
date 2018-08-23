import nodes from '@/app/views/nodes/nodes'
import node from '@/app/views/nodes/node'
import verifyNode from '@/app/views/nodes/verify'
import groupEdit from '@/app/views/nodes/groupEdit'
import groupCreate from '@/app/views/nodes/groupCreate'

export default [
  { path: '/nodes', name: 'nodes', component: nodes, meta: { auth: true } },
  { path: '/nodes/group/create', name: 'nodesGroupCreate', component: groupCreate, meta: { auth: true } },
  { path: '/nodes/group/:id/:page?', name: 'nodesByGroup', component: nodes, meta: { auth: true } },
  { path: '/node/verify/:id', name: 'verifyNode', component: verifyNode, meta: { auth: true } },
  { path: '/node/:action/:id/:tabAction?', name: 'node', component: node, meta: { auth: true } },
  { path: '/group/edit/:id/:tabAction?', name: 'nodeGroupEdit', component: groupEdit, meta: { auth: true } }
]
