function globalMixin (i18n) {
  return {
    data () {
      return {
        loading: true,
        error: false,
        errorItem: '',
        errorCode: 404
      }
    },
    computed: {
      isDevelopmentEnvironment () {
        return (process.env.NODE_ENV === 'development')
      },
      isStagingEnvironment () {
        return (process.env.NODE_ENV === 'staging')
      }
    },
    methods: {
      errorAPI: (error, module) => {
        const keys = Object.keys(error.errors)
        return i18n.t(`${module}.${keys[0]}`)
      },
      confirmedFieldRule: (inputName, rules) => {
        rules.confirmed = inputName + 'Confirm'
        return rules
      },
      getCountryById (id) {
        const found = this.countries.filter((obj) => {
          return obj.code === id
        })

        return (found && found.length) ? found[0] : { code: 0, name: 'N/A' }
      }
    }
  }
}

export default globalMixin
