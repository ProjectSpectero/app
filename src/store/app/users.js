const state = {
  users: [],
  pendingPayment: false
}

const getters = {
  list: state => state.users,
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
  },
  pendingPayment: state => state.pendingPayment
}

const actions = {
  setPendingInvoiceStatus ({ commit }, status) {
    commit('SET_PENDING_INVOICE_STATUS', status)
  }
}

const mutations = {
  SET_PENDING_INVOICE_STATUS (state, status) {
    state.pendingPayment = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
