import Vue from 'vue'
import Vuex from 'vuex'

// import appModules from '@/store/app'
// import daemonModules from '@/store/daemon'
// import sharedModules from '@/store/shared'

Vue.use(Vuex)

export default new Vuex.Store({
  // modules: Object.assign(appModules, daemonModules, sharedModules),
  strict: process.env.NODE_ENV !== 'production'
})
