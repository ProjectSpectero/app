import authRoutes from './auth'
import userRoutes from './users'
import paymentRoutes from './payments'
import nodeRoutes from './nodes'
import marketRoutes from './market'
import orderRoutes from './orders'
import invoiceRoutes from './invoices'
import defaultRoutes from './default'

export default [
  ...authRoutes,
  ...userRoutes,
  ...paymentRoutes,
  ...nodeRoutes,
  ...marketRoutes,
  ...orderRoutes,
  ...invoiceRoutes,
  ...defaultRoutes
]
