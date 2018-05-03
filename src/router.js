import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import store from '@/store'

import appRoutes from '@/app/routes'
import daemonRoutes from '@/daemon/routes'
import sharedRoutes from '@/shared/routes'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  saveScrollPosition: true,
  scrollBehavior: (to, from, pos) => to.hash ? { selector: to.hash } : { x: 0, y: 0 },
  routes: [
    ...appRoutes,
    ...daemonRoutes,
    ...sharedRoutes
  ]
})

// Test authentication before landing on each route request
router.beforeEach((to, from, next) => {
  // Check login status by either decoding the cookie or
  // testing for a token in store (if any)

  store.dispatch('appAuth/checkLogin').then(loggedIn => {
    // Handle routes requiring authentication
    // or handle routes that arent view-able by already logged in users (default to /dashboard)
    // else handles regular routes
    if (loggedIn) {
      // Fetch freshdesk url if not found
      store.dispatch('appAuth/fetchFreshdeskURL').then(() => {
        processRoute(loggedIn, to, from, next)
      })
    } else {
      processRoute(loggedIn, to, from, next)
    }
  })
})

function processRoute (loggedIn, to, from, next) {
  console.log('processRoute kicked in')
  if (to.matched.some(record => record.meta.auth)) {
    if (loggedIn) {
      next()
    } else {
      // Force the same behavior as logging out (remove cookie + clean store)
      // for scenarios where our cookie has expired
      store.dispatch('appAuth/logout').then(loggedIn => {
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
}

export default router
