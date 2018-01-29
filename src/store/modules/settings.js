const state = {
  layout: 'master',
  bar: null
}

const getters = {
  layout: (state) => state.layout,
  bar: (state) => state.bar
}

const actions = {
  switchLayout: ({ commit }, layout) => {
    commit('SWITCH_LAYOUT', layout || 'master')
  },
  switchBarComponent: ({ commit }, component) => {
    commit('SWITCH_BAR_COMPONENT', component)
  },
  removeBarComponent: ({ commit }) => {
    commit('REMOVE_BAR_COMPONENT')
  }
}

const mutations = {
  SWITCH_LAYOUT: (state, layout) => {
    state.layout = layout
  },
  SWITCH_BAR_COMPONENT: (state, component) => {
    state.bar = component
    localStorage.setItem('specteroBar', state.bar)
  },
  REMOVE_BAR_COMPONENT: (state, component) => {
    state.bar = null
    localStorage.removeItem('specteroBar')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
