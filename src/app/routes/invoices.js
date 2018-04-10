
import Invoices from '@/app/components/invoices/invoices'
import Invoice from '@/app/components/invoices/invoice'

export default [
  { path: '/invoices', name: 'invoices', component: Invoices, meta: { auth: true } },
  { path: '/invoices/:status/:page?', name: 'invoicesByStatus', component: Invoices, meta: { auth: true } },
  { path: '/invoice/:id', name: 'invoice', component: Invoice, meta: { auth: true } }
]
