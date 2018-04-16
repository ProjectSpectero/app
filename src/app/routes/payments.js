// Authentication routes

import Paypal from '@/app/components/payments/paypal'
import paypalCallback from '@/app/components/payments/paypalCallback'
import Stripe from '@/app/components/payments/stripe'
import creditPayment from '@/app/components/payments/accountCredit'
import addCredit from '@/app/components/payments/addCredit'

export default [
  { path: '/payment/stripe/:invoiceId', name: 'stripe', component: Stripe },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback },
  { path: '/payment/paypal/:invoiceId', name: 'paypal', component: Paypal },
  { path: '/payment/credit/paypal/:invoiceId', name: 'paypalCredit', component: creditPayment, meta: { auth: true } },
  { path: '/payment/credit/add', name: 'addCredit', component: addCredit, meta: { auth: true } }
]
