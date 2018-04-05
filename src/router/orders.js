import Orders from '@/components/users/orders'
import Order from '@/components/users/order'

export default [
  { path: '/orders', name: 'orders', component: Orders, meta: { auth: true } },
  { path: '/orders/:status?/:page?', name: 'ordersByStatus', component: Orders, meta: { auth: true } },
  { path: '/order/:id', name: 'order', component: Order, meta: { auth: true } }
]
