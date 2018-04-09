
import Invoices from '@/components/invoices/invoices'
import Invoice from '@/components/invoices/invoice'

export default [
  { path: '/invoices/:page?', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoice/:id', name: 'invoice', component: Invoice, meta: { auth: true } }
]
