import market from '@/components/app/market/market'
import marketView from '@/components/app/market/view'
import cart from '@/components/app/market/cart'

export default [
  { path: '/market', name: 'market', component: market, meta: { auth: true } },
  { path: '/market/:type/:id/view', name: 'marketView', component: marketView },
  { path: '/market/cart', name: 'cart', component: cart }
]
