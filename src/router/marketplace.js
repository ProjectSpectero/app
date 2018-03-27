import marketplace from '@/components/marketplace/marketplace'
import marketplaceView from '@/components/marketplace/view'
import cart from '@/components/marketplace/cart'

export default [
  { path: '/market', name: 'marketplace', component: marketplace, meta: { auth: true } },
  { path: '/market/:type/:id/view', name: 'marketplaceView', component: marketplaceView },
  { path: '/market/cart', name: 'cart', component: cart }
]
