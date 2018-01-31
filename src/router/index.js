import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import store from '../store'

// Routes
import authRoutes from './auth'
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
    ...defaultRoutes
  ]
})

// Test authentication before landing on each route request
router.beforeEach((to, from, next) => {
  store.dispatch('auth/checkLogin').then(loggedIn => {
    // Handle routes requiring authentication
    // or handle routes that arent view-able by already logged in users (default to /dashboard)
    // else handles regular routes
    if (to.matched.some(record => record.meta.auth)) {
      console.log('record.meta.auth found')
      if (loggedIn) {
        console.log('loginCheck at meta.auth')
        next()
      } else {
        console.log('Redirecting to login')
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    } else if (to.matched.some(record => record.meta.antiAuth)) {
      console.log('record.meta.antiAuth found')
      if (loggedIn) {
        console.log('Redirecting to dashboard')
        next({ name: 'dashboard' })
      } else {
        console.log('loginCheck at meta.antiAuth')
        next()
      }
    } else {
      console.log('router else')
      next()
    }
  })
})

export default router
