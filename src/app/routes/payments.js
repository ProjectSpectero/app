// Payment routes
import paypalCallback from '@/app/views/payments/paypalCallback'
import addCredit from '@/app/views/payments/addCredit'

export default [
  { path: '/payment/paypal/callback', name: 'paypalCallback', component: paypalCallback, meta: { auth: true } },
  { path: '/payment/credit/add', name: 'addCredit', component: addCredit, meta: { auth: true } }
]
