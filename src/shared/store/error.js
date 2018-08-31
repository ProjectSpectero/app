import router from '@/router'

const state = {
  name: null,
  type: null,
  date: null,
  stack: null
}

const getters = {
  error: (state) => {
    return {
      name: state.name,
      type: state.type,
      date: state.date,
      stack: state.stack
    }
  }
}

const actions = {
  add: ({ commit }, data) => {
    commit('SWITCH_ERROR', data)
    router.push({ name: 'app-error' })
  },
  clear: ({ commit }) => {
    commit('CLEAR_ERROR')
  }
}

const mutations = {
  SWITCH_ERROR: (state, data) => {
    const title = '*** APPLICATION ' + (data.type ? data.type.toUpperCase() : ' ERROR') + (data.name ? ' (' + data.name + ')' : '') + ' ***'

    state.name = data.name
    state.type = data.type
    state.date = data.date
    state.stack = data.stack

    console.warn(title)
    console.warn(data.stack)
  },
  CLEAR_ERROR: (state) => {
    state.name = null
    state.type = null
    state.date = null
    state.stack = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
