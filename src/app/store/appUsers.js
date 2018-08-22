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
        required: true,
        max: 50
      },
      address_line_1: {
        required: true,
        max: 255
      },
      address_line_2: {
        max: 255
      },
      city: {
        required: true,
        max: 64
      },
      state: {
        required: true,
        max: 64
      },
      post_code: {
        required: true,
        max: 10
      },
      country: {
        required: true,
        max: 64
      },
      phone_no: {
        max: 64
      },
      tax_identification: {
        max: 96
      },
      organization: {
        max: 64
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
