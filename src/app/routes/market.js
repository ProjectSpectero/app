import market from '@/app/components/market/market'
import marketView from '@/app/components/market/view'
import cart from '@/app/components/market/cart'

export default [
  { path: '/market', name: 'market', component: market, meta: { auth: true } },
  { path: '/market/listed', name: 'marketListed', component: market, meta: { auth: true } },
  { path: '/market/mine', name: 'marketMine', component: market, meta: { auth: true } },
  { path: '/market/:type/:id/view', name: 'marketView', component: marketView },
  { path: '/market/cart', name: 'cart', component: cart }
]
