import Vue from 'vue'

export default {
  data: () => ({
    loading: true,
    error: null
  }),
  methods: {
    error404: () => {
      window.location.href = '/404'
    },
    errorAPI: (error, module) => {
      const keys = Object.keys(error.errors)
      console.log(Vue.prototype)
      this.error = Vue.prototype.$t(`errors.${keys[0]}`)
      this.loading = false
    }
  }
}
