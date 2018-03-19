import listings from '@/components/marketplace/listings'

export default [
  { path: '/marketplace', name: 'marketplace', component: listings, meta: { auth: true } }
]
