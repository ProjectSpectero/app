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
      nodeEnvironment () {
        console.log('process.env', process.env)
        return process.env.NODE_ENV
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
