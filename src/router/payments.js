// Authentication routes

import processPaypal from '@/components/payments/processPaypal'

export default [
  { path: '/payment/paypal/callback', name: 'processPaypal', component: processPaypal, meta: { layout: 'auth' } }
]
