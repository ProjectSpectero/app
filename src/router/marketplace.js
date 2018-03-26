import marketplace from '@/components/marketplace/marketplace'
import marketplaceView from '@/components/marketplace/view'
import marketplaceBuy from '@/components/marketplace/buy'

export default [
  { path: '/marketplace', name: 'marketplace', component: marketplace, meta: { auth: true } },
  { path: '/marketplace/:type/:id/view', name: 'marketplaceView', component: marketplaceView },
  { path: '/marketplace/:type/:id/buy', name: 'marketplaceBuy', component: marketplaceBuy, meta: { auth: true } }
]
