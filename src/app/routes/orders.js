import orders from '@/app/views/orders/orders'
import order from '@/app/views/orders/order'
import resources from '@/app/views/orders/resources'
import orderInvoices from '@/app/views/orders/orderInvoices'
import pro from '@/app/views/pro/pro'

export default [
  { path: '/orders', name: 'orders', component: orders, meta: { auth: true } },
  { path: '/orders/:status/:page?', name: 'ordersByStatus', component: orders, meta: { auth: true } },

  { path: '/enterprise', name: 'enterpriseOrders', component: orders, meta: { auth: true } },
  { path: '/enterprise/:status/:page?', name: 'enterpriseOrdersByStatus', component: orders, meta: { auth: true } },

  { path: '/order/resources/:id', name: 'orderResources', component: resources, meta: { auth: true } },
  { path: '/order/:id/invoices/:page?', name: 'orderInvoices', component: orderInvoices, meta: { auth: true } },
  { path: '/order/:id', name: 'order', component: order, meta: { auth: true } },

  { path: '/pro', name: 'pro', component: pro }
]
