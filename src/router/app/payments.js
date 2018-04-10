// Authentication routes

import Paypal from '@/components/app/payments/paypal'
import paypalCallback from '@/components/app/payments/paypalCallback'
import Stripe from '@/components/app/payments/stripe'
import creditPayment from '@/components/app/payments/accountCredit'
import addCredit from '@/components/app/payments/addCredit'

export default [
  { path: '/payment/stripe/:invoiceId', name: 'stripe', component: Stripe },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback },
  { path: '/payment/paypal/:invoiceId', name: 'paypal', component: Paypal },
  { path: '/payment/credit/paypal/:invoiceId', name: 'paypalCredit', component: creditPayment, meta: { auth: true } },
  { path: '/payment/credit/add', name: 'addCredit', component: addCredit, meta: { auth: true } }
]
