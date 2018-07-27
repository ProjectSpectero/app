// Authentication routes

import Paypal from '@/app/components/payments/paypal'
import paypalCallback from '@/app/components/payments/paypalCallback'
import Stripe from '@/app/components/payments/stripe'
import creditPayment from '@/app/components/payments/accountCredit'
import addCredit from '@/app/components/payments/addCredit'
import Crypto from '@/app/components/payments/crypto'

export default [
  { path: '/payment/stripe/:invoiceId', name: 'stripe', component: Stripe, meta: { auth: true } },
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback, meta: { auth: true } },
  { path: '/payment/paypal/:invoiceId', name: 'paypal', component: Paypal, meta: { auth: true } },
  { path: '/payment/credit/paypal/:invoiceId', name: 'paypalCredit', component: creditPayment, meta: { auth: true } },
  { path: '/payment/credit/add', name: 'addCredit', component: addCredit, meta: { auth: true } },
  { path: '/payment/crypto/:invoiceId', name: 'crypto', component: Crypto, meta: { auth: true } }
]
