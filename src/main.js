import Vue from 'vue'
import app from './app'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import VeeValidate from 'vee-validate'
import VueProgressBar from 'vue-progressbar'
import Toasted from 'vue-toasted'
import VueMoment from 'vue-moment'
import { ClientTable } from 'vue-tables-2'
import globalMixin from './mixins/global'

// Load .env configurations
require('dotenv').config()

// Load packages
Vue.use(VueI18n)
Vue.use(VueCookie)
Vue.use(VeeValidate)
Vue.use(ClientTable)
Vue.use(VueMoment)
Vue.use(VueProgressBar, {
  color: '#18FF6D',
  failedColor: 'red',
  thickness: '5px'
})
Vue.use(Toasted, {
  className: 'toast',
  position: 'bottom-right',
  duration: 3000,
  singleton: false
})

// i18n data
const messages = { en: require('./lang/en.js') }
const i18n = new VueI18n({ locale: 'en', messages })
const globalMethods = globalMixin(i18n)

// Load global mixin
Vue.mixin(globalMethods)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<app/>',
  components: { app }
})
