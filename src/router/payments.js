// Authentication routes

import Paypal from '@/components/payments/paypal'
import paypalCallback from '@/components/payments/paypalCallback'
import Stripe from '@/components/payments/stripe'
import creditPayment from '@/components/payments/accountCredit'
import addCredit from '@/components/payments/addCredit'
import Orders from '@/components/users/orders'
import Order from '@/components/users/order'
import Invoices from '@/components/users/invoices'
import Invoice from '@/components/users/invoice'

export default [
  { path: '/payment/stripe/:invoiceId', name: 'stripe', component: Stripe },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback },
  { path: '/payment/paypal/:invoiceId', name: 'paypal', component: Paypal },
  { path: '/payment/credit/paypal/:invoiceId', name: 'paypalCredit', component: creditPayment, meta: { auth: true } },
  { path: '/payment/credit/add', name: 'addCredit', component: addCredit, meta: { auth: true } },
  { path: '/orders/:page?', name: 'orders', component: Orders, meta: { auth: true } },
  { path: '/order/:id', name: 'order', component: Order, meta: { auth: true } },
  { path: '/invoices/:page?', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoice/:id', name: 'invoice', component: Invoice, meta: { auth: true } }
]
