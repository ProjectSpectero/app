import marketAPI from '@/app/api/market'
import nodeAPI from '@/app/api/node'

const state = {
  cart: [],
  results: [],
  pagination: null,
  filters: [],
  grouped: true,
  buttonEnabled: false,
  plans: null,
  loading: true
}

const getters = {
  cart: (state) => state.cart,
  cartCounter: (state) => state.cart.length,
  buttonEnabled: (state) => state.buttonEnabled,
  filters: (state) => state.filters,
  grouped: (state) => state.grouped,
  pagination: (state) => state.pagination,
  results: (state) => state.results,
  plan: state => (planId) => {
    if (state.plans && state.plans[planId]) {
      let plan = state.plans[planId]
      plan.id = planId
      return plan
    }
  },
  loading: (state) => state.loading
}

const actions = {
  async fetch ({ getters, commit }, data) {
    commit('SET_LOADING', true)
    commit('CLEAR_RESULTS')

    await marketAPI.search({
      queryParams: {
        page: data.page || 1,
        perPage: data.perPage || 10,
        includeGrouped: getters.grouped
      },
      data: {
        rules: getters.filters
      },
      success: response => {
        commit('UPDATE_RESULTS', { results: response.data.result, pagination: response.data.pagination })
        commit('SET_LOADING', false)
      },
      fail: (e) => {
        commit('SET_LOADING', false)
        console.error('Error market api search:', e)
      }
    })
  },
  async fetchMine ({ getters, commit }, data) {
    commit('SET_LOADING', true)
    commit('CLEAR_RESULTS')

    await nodeAPI.myNodes({
      queryParams: {
        page: data.page || 1,
        perPage: data.perPage || 10
      },
      data: {
        rules: getters.filters
      },
      success: response => {
        commit('UPDATE_RESULTS', { results: response.data.result, pagination: response.data.pagination })
        commit('SET_LOADING', false)
      },
      fail: (e) => {
        commit('SET_LOADING', false)
        console.error('Error market api search:', e)
      }
    })
  },
  async fetchPlans ({ commit }) {
    await marketAPI.plans({
      success: response => {
        commit('UPDATE_PLANS', { results: response.data.result })
      },
      fail: (e) => {
        console.error('Error plans fetch:', e)
      }
    })
  },
  updateFilter: ({ commit }, data) => {
    commit('UPDATE_FILTER', data)
    commit('TOGGLE_BUTTON', true)
  },
  updateGrouped: ({ commit }, status) => {
    commit('UPDATE_GROUPED', status)
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
  CLEAR_RESULTS: (state) => {
    state.results = []
  },
  TOGGLE_BUTTON: (state, status) => {
    state.buttonEnabled = status
  },
  UPDATE_GROUPED: (state, status) => {
    state.grouped = status
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
  },
  UPDATE_PLANS: (state, data) => {
    let plans = data.results
    for (let i in plans) {
      if (plans.hasOwnProperty(i)) {
        if (plans[i].yearly_discount_pct) {
          plans[i].yearly_discount_pct = parseFloat(plans[i].yearly_discount_pct)
        }
      }
    }
    state.plans = plans
  },
  SET_LOADING: (state, status) => {
    state.loading = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
