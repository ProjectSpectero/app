import marketplaceAPI from '@/api/marketplace.js'

const state = {
  results: [],
  pagination: null,
  filters: [],
  grouped: true,
  buttonEnabled: false
}

const getters = {
  buttonEnabled: (state) => state.buttonEnabled,
  filters: (state) => state.filters,
  grouped: (state) => state.grouped,
  pagination: (state) => state.pagination,
  results: (state) => state.results
}

const actions = {
  async fetch ({ getters, commit }, data) {
    await marketplaceAPI.search({
      page: data.page,
      limit: data.perPage,
      includeGrouped: getters.grouped,
      data: {
        rules: getters.filters
      },
      success: response => {
        commit('UPDATE_RESULTS', { results: response.data.result, pagination: response.data.pagination })
      },
      fail: (e) => {
        console.log(e)
      }
    })
  },
  updateFilter: ({ commit }, data) => {
    commit('UPDATE_FILTER', data)
    commit('TOGGLE_BUTTON', true)
  },
  removeFilter: ({ commit, dispatch }, index) => {
    commit('REMOVE_FILTER', index)
    commit('TOGGLE_BUTTON', true)
  },
  toggleButton ({ commit }, status) {
    commit('TOGGLE_BUTTON', status)
  }
}

const mutations = {
  UPDATE_RESULTS: (state, data) => {
    state.results = data.results
    state.pagination = data.pagination
  },
  TOGGLE_BUTTON: (state, status) => {
    state.buttonEnabled = status
  },
  UPDATE_FILTER: (state, data) => {
    // Update pre-filled filter with the new value and operator
    // or create a new instance of it
    if (data.index !== -1) {
      state.filters[data.index] = data.filter
    } else {
      state.filters.push(data.filter)
    }
  },
  REMOVE_FILTER: (state, index) => {
    if (index !== undefined && index !== -1) {
      state.filters.splice(index, 1)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
