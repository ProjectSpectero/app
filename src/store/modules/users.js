import userAPI from '../../api/user.js'

const state = {
  users: []
}

const getters = {
  list: state => state.users,
  editRules: () => {
    return {
      authKey: {
        required: true,
        max: 50,
        regex: /^[a-zA-Z][\w]*$/
      },
      password: {
        max: 72
      },
      emailAddress: {
        required: true,
        email: true
      },
      fullName: {
        max: 50
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
