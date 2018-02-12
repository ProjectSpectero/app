// Authentication routes

import processPaypal from '@/components/payments/processPaypal'
import Stripe from '@/components/payments/stripe'

export default [
  { path: '/payment/stripe', name: 'stripe', component: Stripe },
  { path: '/payment/paypal/callback', name: 'processPaypal', component: processPaypal, meta: { layout: 'auth' } }
]
