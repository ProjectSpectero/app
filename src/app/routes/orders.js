import Orders from '@/app/components/orders/orders'
import Order from '@/app/components/orders/order'
import resources from '@/app/components/orders/resources'

export default [
  { path: '/orders', name: 'orders', component: Orders, meta: { auth: true } },
  { path: '/order/resources/:id', name: 'resources', component: resources, meta: { auth: true } },
  { path: '/orders/:status/:page?', name: 'ordersByStatus', component: Orders, meta: { auth: true } },
  { path: '/order/:id', name: 'order', component: Order, meta: { auth: true } }
]
