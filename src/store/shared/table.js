const state = {
  sortColumn: 'friendly_name',
  sortDirection: 'desc'
}

const getters = {
  sortColumn: state => state.sortColumn,
  sortDirection: state => state.sortDirection
}

const actions = {
  setSort ({ commit }, data) {
    commit('SET_SORT', data)
  }
}

const mutations = {
  SET_SORT (state, data) {
    state.sortColumn = data.column
    state.sortDirection = data.direction

    console.log('sorted column', state.sortColumn, state.sortDirection)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
