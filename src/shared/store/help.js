const state = {
  showHelp: false,
  contentsKey: null
}

const getters = {
  showHelp: (state) => state.showHelp,
  contentsKey: (state) => state.contentsKey
}

const actions = {
  togglePanel: ({ commit, state }) => {
    commit('SWITCH_PANEL_STATUS', !state.showHelp)
  },
  hidePanel: ({ commit, state }) => {
    if (state.showHelp) {
      commit('SWITCH_PANEL_STATUS', false)
    }
  },
  setContentsKey: ({ state, commit }, key) => {
    if (state.contentsKey !== key) {
      commit('SET_CONTENTS_KEY', key)
    }
  }
}

const mutations = {
  SWITCH_PANEL_STATUS: (state, status) => {
    state.showHelp = status
  },
  SET_CONTENTS_KEY: (state, key) => {
    state.contentsKey = 'help.' + key
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
