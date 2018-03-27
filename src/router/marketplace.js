import marketplace from '@/components/marketplace/marketplace'
import marketplaceView from '@/components/marketplace/view'
import cart from '@/components/marketplace/cart'

export default [
  { path: '/marketplace', name: 'marketplace', component: marketplace, meta: { auth: true } },
  { path: '/marketplace/:type/:id/view', name: 'marketplaceView', component: marketplaceView },
  { path: '/cart', name: 'cart', component: cart }
]
