import orders from '@/app/components/orders/orders'
import order from '@/app/components/orders/order'
import resources from '@/app/components/orders/resources'
import orderInvoices from '@/app/components/orders/orderInvoices'

export default [
  { path: '/orders', name: 'orders', component: orders, meta: { auth: true } },
  { path: '/orders/enterprise', name: 'enterpriseOrders', component: orders, meta: { auth: true } },
  { path: '/order/resources/:id', name: 'resources', component: resources, meta: { auth: true } },
  { path: '/orders/enterprise/:status/:page?', name: 'enterpriseOrdersByStatus', component: orders, meta: { auth: true } },
  { path: '/orders/:status/:page?', name: 'ordersByStatus', component: orders, meta: { auth: true } },
  { path: '/order/:id/invoices/:page?', name: 'orderInvoices', component: orderInvoices, meta: { auth: true } },
  { path: '/order/:id', name: 'order', component: order, meta: { auth: true } }
]
