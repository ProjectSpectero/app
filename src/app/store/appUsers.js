const state = {
}

const getters = {
  editRules: () => {
    return {
      email: {
        email: true
      },
      password: {
        min: 5,
        max: 72
      },
      name: {
        max: 50
      },
      address_line_1: {
        max: 255
      },
      address_line_2: {
        max: 255
      },
      city: {
        max: 255
      },
      state: {
        max: 255
      },
      post_code: {
        max: 255
      },
      country: {
        max: 255
      },
      phone_no: {
        max: 255
      },
      tax_identification: {
        max: 255
      },
      organization: {
        max: 255
      }
    }
  },
  createRules: (state, getters) => {
    let rules = Object.assign({}, getters.editRules)
    rules.password.required = true
    return rules
  }
}

const actions = {

}

const mutations = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
