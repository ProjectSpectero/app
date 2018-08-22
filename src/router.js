import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
// import store from '@/store'
// import { getCookie } from 'tiny-cookie'

import appRoutes from '@/app/routes'
import daemonRoutes from '@/daemon/routes'
import sharedRoutes from '@/shared/routes'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  saveScrollPosition: true,
  routes: [
    ...appRoutes,
    ...daemonRoutes,
    ...sharedRoutes
  ]
})

// // Test authentication before landing on each route request
// router.beforeEach((to, from, next) => {
//   // Hide help sidebar
//   store.dispatch('help/hidePanel').then(() => {
//     // Check login status by either decoding the cookie or
//     // testing for a token in store (if any)
//     store.dispatch('appAuth/checkLogin').then(loggedIn => {
//       // Handle routes requiring authentication
//       // or handle routes that arent view-able by already logged in users (default to /dashboard)
//       // else handles regular routes
//       processRoute(loggedIn, to, from, next)
//     })
//   })
// })

// function processRoute (loggedIn, to, from, next) {
//   if (to.matched.some(record => record.meta.auth)) {
//     if (loggedIn) {
//       const hasDaemonUser = store.getters['daemonAuth/user']
//       const hasDaemonCookie = (getCookie(process.env.DAEMON_COOKIE) !== null)

//       // Are we inside the daemon? Then we must make sure our cookie + daemon auth
//       // are synced and auto-login again if not
//       if (hasDaemonUser && to.params.nodeId && !hasDaemonCookie) {
//         console.warn('Daemon user is set but cookie is out of sync. Attempting to autologin again ...')
//         store.dispatch('daemonAuth/autologin').then(daemonLoggedIn => {
//           next()
//         })
//       } else {
//         next()
//       }
//     } else {
//       const redirectQuery = to.fullPath === '/' ? {} : { redirect: to.fullPath }

//       // Force the same behavior as logging out (remove cookie + clean store)
//       // for scenarios where our cookie has expired
//       store.dispatch('appAuth/logout').then(loggedIn => {
//         next({ name: 'login', query: redirectQuery })
//       })
//     }
//   } else if (to.matched.some(record => record.meta.antiAuth)) {
//     if (loggedIn) {
//       next({ name: 'dashboard' })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// }

export default router
