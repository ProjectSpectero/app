import Vue from 'vue'
import Vuex from 'vuex'

import appModules from '@/app/store'
import daemonModules from '@/daemon/store'
import sharedModules from '@/shared/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: Object.assign(appModules, daemonModules, sharedModules),
  strict: process.env.NODE_ENV !== 'production'
})
