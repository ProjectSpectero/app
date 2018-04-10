import Vue from 'vue'
import Vuex from 'vuex'

import appModules from './app'
import daemonModules from './daemon'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: Object.assign(appModules, daemonModules),
  strict: process.env.NODE_ENV !== 'production'
})
