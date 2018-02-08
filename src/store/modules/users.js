import userAPI from '@/api/user.js'

const state = {
  users: []
}

const getters = {
  list: state => state.users,
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
    let rules = JSON.parse(JSON.stringify(getters.editRules))
    rules.password.required = true
    return rules
  }
}

const actions = {
  fetch ({ commit }) {
    userAPI.list({
      success: response => {
        const users = response.data.result

        for (let i = 0; i < users.length; i++) { // Inject temp fields into user objects
          let user = users[i]
          user.status = 'online'
        }

        commit('UPDATE_USERS', response.data.result)
      },
      fail: error => {
        console.log(error)
        // TODO: implement
      }
    })
  }
}

const mutations = {
  UPDATE_USERS (state, users) {
    state.users = users
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
