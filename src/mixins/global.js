import Vue from 'vue'

Vue.mixin({
  data: () => ({
    loading: true,
    error: null
  }),
  methods: {
    error404: () => {
      this.$router.push({ name: '404' })
    },
    errorAPI: (error) => {
      const keys = Object.keys(error.errors)
      this.error = this.$i18n.t(`errors.${keys[0]}`)
      this.loading = false
    }
  }
})
