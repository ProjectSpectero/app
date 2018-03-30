import market from '@/components/market/market'
import marketView from '@/components/market/view'
import cart from '@/components/market/cart'

export default [
  { path: '/market', name: 'market', component: market, meta: { auth: true } },
  { path: '/market/:type/:id/view', name: 'marketView', component: marketView },
  { path: '/market/cart', name: 'cart', component: cart }
]
