const state = {
}

const getters = {
  editRules: () => {
    return {
      email: {
        required: true,
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
        min: 1,
        max: 255
      },
      address_line_2: {
        min: 1,
        max: 255
      },
      city: {
        min: 1,
        max: 255
      },
      state: {
        min: 1,
        max: 255
      },
      post_code: {
        min: 1,
        max: 64
      },
      country: {
        min: 1,
        max: 255
      },
      phone_no: {
        min: 1,
        max: 255
      },
      tax_identification: {
        min: 1,
        max: 255
      },
      organization: {
        min: 1,
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
