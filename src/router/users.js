// Authentication routes

import Account from '@/components/users/account'
import Dashboard from '@/components/users/dashboard'
import Orders from '@/components/users/orders'
import Order from '@/components/users/order'
import Invoices from '@/components/users/invoices'
import Invoice from '@/components/users/invoice'

export default [
  { path: '/account', name: 'account', component: Account, meta: { auth: true } },
  { path: '/orders', name: 'orders', component: Orders, meta: { auth: true } },
  { path: '/orders/:id', name: 'order', component: Order, meta: { auth: true } },
  { path: '/invoices', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoices/:id', name: 'invoice', component: Invoice, meta: { auth: true } },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { auth: true } }
]
