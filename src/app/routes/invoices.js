
import Invoices from '@/app/views/invoices/invoices'
import Invoice from '@/app/views/invoices/invoice'
import Checkout from '@/app/views/checkout/checkout'

export default [
  { path: '/invoices', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoices/:status/:page?', name: 'invoicesByStatus', component: Invoices, meta: { auth: true } },
  { path: '/invoice/:id', name: 'invoice', component: Invoice, meta: { auth: true } },
  { path: '/invoice/:id/checkout', name: 'checkout', component: Checkout, meta: { auth: true } }
]
