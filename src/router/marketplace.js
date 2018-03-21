import marketplace from '@/components/marketplace/marketplace'

export default [
  { path: '/marketplace', name: 'marketplace', component: marketplace, meta: { auth: true } }
]
