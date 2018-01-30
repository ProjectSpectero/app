import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

// import store from '../store'
// import auth from '../api/auth.js'

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
// router.beforeEach((to, from, next) => {
//   const loginCheck = auth.checkLogin()

//   // JWT token verified, update current user in Vuex store
//   if (loginCheck !== false) {
//     store.dispatch('auth/setCurrentJWT', loginCheck)
//   }

//   // Handle routes requiring authentication
//   // or handle routes that arent view-able by already logged in users (default to /dashboard)
//   // else handles regular routes
//   if (to.matched.some(record => record.meta.auth)) {
//     if (loginCheck !== false) {
//       next()
//     } else {
//       next({ name: 'login', query: { redirect: to.fullPath } })
//     }
//   } else if (to.matched.some(record => record.meta.antiAuth)) {
//     if (loginCheck !== false) {
//       next({ name: 'dashboard' })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

export default router
