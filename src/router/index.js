import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import store from '@/store'

// Routes
import authRoutes from './auth'
import userRoutes from './users'
import paymentRoutes from './payments'
import defaultRoutes from './default'

Vue.use(Router)
Vue.use(Meta)

// Meta keys for router:
// auth:     redirect user when not logged in (login required from user to access route)
// antiAuth: redirect user when already authenticated (route for non-logged in users only)
const router = new Router({
  mode: 'history',
  saveScrollPosition: true,
  routes: [
    ...authRoutes,
    ...userRoutes,
    ...paymentRoutes,
    ...defaultRoutes
  ]
})

// Test authentication before landing on each route request
router.beforeEach((to, from, next) => {
  // Check login status by either decoding the cookie or
  // testing for a token in store (if any)

  store.dispatch('auth/checkLogin').then(loggedIn => {
    // Handle routes requiring authentication
    // or handle routes that arent view-able by already logged in users (default to /dashboard)
    // else handles regular routes
    if (to.matched.some(record => record.meta.auth)) {
      if (loggedIn) {
        next()
      } else {
        // Force the same behavior as logging out (remove cookie + clean store)
        // for scenarios where our cookie has expired
        store.dispatch('auth/logout').then(loggedIn => {
          next({ name: 'login', query: { redirect: to.fullPath } })
        })
      }
    } else if (to.matched.some(record => record.meta.antiAuth)) {
      if (loggedIn) {
        next({ name: 'dashboard' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
})

export default router
