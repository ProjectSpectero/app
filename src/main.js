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
import VueAnalytics from 'vue-ua'
import VueModal from 'vue-js-modal'
import { ClientTable } from 'vue-tables-2'
import VueCurrencyFilter from 'vue-currency-filter'
import VueClipboard from 'vue-clipboard2'
import VueFloatLabel from 'vue-float-label'
import VueTooltip from 'vue-directive-tooltip'
import FlagIcon from 'vue-flag-icon'
import PrettyCheckbox from 'pretty-checkbox-vue'
import VueNumeric from 'vue-numeric'

import globalMixin from '@/shared/mixins/global'

// Load .env configurations
require('dotenv').config()

// Load packages
Vue.use(VueI18n)
Vue.use(VueCookie)
Vue.use(VeeValidate)
Vue.use(ClientTable)
Vue.use(VueMoment)
Vue.use(VueClipboard)
Vue.use(VueFloatLabel)
Vue.use(FlagIcon)
Vue.use(PrettyCheckbox)
Vue.use(VueNumeric)

Vue.use(VueTooltip, {
  delay: 0,
  placement: 'bottom',
  offset: 5
})

Vue.use(VueModal, {
  dynamic: true
})

Vue.use(VueCurrencyFilter, {
  symbol: '$',
  symbolSpacing: false,
  fractionCount: 2,
  fractionSeparator: '.',
  thousandsSeparator: ','
})

Vue.use(VueProgressBar, {
  color: '#18FF6D',
  failedColor: 'red',
  thickness: '5px'
})

Vue.use(Toasted, {
  className: 'toast',
  position: 'bottom-right',
  duration: 5000,
  singleton: false
})

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    appName: 'Spectero',
    appVersion: '1.0',
    trackingId: process.env.GOOGLE_ANALYTICS_ID,
    debug: process.env.NODE_ENV !== 'development',
    vueRouter: router,
    trackPage: true // Whether you want page changes to be recorded as pageviews (website) or screenviews (app)
    // ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive) (optional)
  })
}

// i18n data
const i18n = new VueI18n({ locale: 'en', messages: { en: require('./shared/lang/en.js') } })
const globalMethods = globalMixin(i18n)

// Load global mixin
Vue.mixin(globalMethods)

Vue.config.productionTip = false

Vue.prototype.$filters = Vue.options.filters

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    app
  },
  template: '<app/>'
})
