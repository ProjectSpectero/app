function globalMixin (i18n) {
  return {
    methods: {
      error404: () => {
        window.location.href = '/404'
      },
      errorAPI: (error, module) => {
        const keys = Object.keys(error.errors)
        console.log(error)
        return i18n.t(`${module}.${keys[0]}`)
      },
      confirmedFieldRule: (inputName, rules) => {
        rules.confirmed = inputName + 'Confirm'
        return rules
      }
    }
  }
}

export default globalMixin
