import marketAPI from '@/app/api/market.js'

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
    await marketAPI.search({
      page: data.page,
      limit: data.perPage,
      includeGrouped: getters.grouped,
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
  async fetchPlans ({ getters, commit }, data) {
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
  TOGGLE_BUTTON: (state, status) => {
    state.buttonEnabled = status
  },
  UPDATE_GROUPED: (state, status) => {
    state.grouped = status
    console.log('Updated grouped to', state.grouped)
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
    for (var i in plans) {
      if (plans.hasOwnProperty(i)) {
        let plan = plans[i]
        plan.yearly_discount_pct = parseFloat(plan.yearly_discount_pct)
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
