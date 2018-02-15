// Authentication routes

import Paypal from '@/components/payments/paypal'
import paypalCallback from '@/components/payments/paypalCallback'
import Stripe from '@/components/payments/stripe'

export default [
  { path: '/payment/process/stripe/:invoiceId', name: 'stripe', component: Stripe },
  { path: '/payment/process/paypal/:invoiceId', name: 'paypal', component: Paypal },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback, meta: { layout: 'auth' } }
]
