// Authentication routes

import Paypal from '@/components/payments/paypal'
import paypalCallback from '@/components/payments/paypalCallback'
import Stripe from '@/components/payments/stripe'
import Orders from '@/components/users/orders'
import Order from '@/components/users/order'
import Invoices from '@/components/users/invoices'
import Invoice from '@/components/users/invoice'

export default [
  { path: '/payment/stripe/:invoiceId', name: 'stripe', component: Stripe },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback },
  { path: '/payment/paypal/:invoiceId', name: 'paypal', component: Paypal },
  { path: '/orders', name: 'orders', component: Orders, meta: { auth: true } },
  { path: '/orders/:id', name: 'order', component: Order, meta: { auth: true } },
  { path: '/invoices', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoices/:id', name: 'invoice', component: Invoice, meta: { auth: true } }
]
