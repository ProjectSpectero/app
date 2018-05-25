const state = {
  showHelp: false,
  contentsKey: null
}

const getters = {
  showHelp: (state) => state.showHelp,
  contentsKey: (state) => state.contentsKey
}

const actions = {
  togglePanel: ({ commit }) => {
    commit('TOGGLE_PANEL')
  },
  setContentsKey: ({ state, commit }, key) => {
    if (state.contentsKey !== key) {
      commit('SET_CONTENTS_KEY', key)
    }
  }
}

const mutations = {
  TOGGLE_PANEL: (state) => {
    state.showHelp = !state.showHelp
  },
  SET_CONTENTS_KEY: (state, key) => {
    state.contentsKey = 'help.' + key
    console.log(state.contentsKey)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
