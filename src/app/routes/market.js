import market from '@/app/views/market/market'
import marketView from '@/app/views/market/view'
import cart from '@/app/views/market/cart'

export default [
  { path: '/market', name: 'market', component: market, meta: { layout: 'nocache', auth: true } },
  { path: '/market/listed/:page?', name: 'marketListed', component: market, meta: { layout: 'nocache', auth: true } },
  { path: '/market/mine/:page?', name: 'marketMine', component: market, meta: { layout: 'nocache', auth: true } },
  { path: '/market/:type/:id/view', name: 'marketView', component: marketView, meta: { layout: 'nocache' } },
  { path: '/cart', name: 'cart', component: cart, meta: { layout: 'nocache' } }
]
