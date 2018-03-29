import marketplaceAPI from '@/api/marketplace.js'

const state = {
  cart: [],
  results: [],
  pagination: null,
  filters: [],
  grouped: true,
  buttonEnabled: false
}

const getters = {
  cart: (state) => state.cart,
  cartCounter: (state) => state.cart.length,
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
  refreshCart: ({ commit }) => {
    commit('REFRESH_CART')
  },
  addToCart: ({ commit }, item) => {
    commit('ADD_TO_CART', item)
    commit('REFRESH_CART')
  },
  removeFromCart: ({ commit }, item) => {
    commit('REMOVE_FROM_CART', item)
    commit('REFRESH_CART')
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
  REFRESH_CART: (state) => {
    const cart = localStorage.getItem('specteroCart')

    if (cart) {
      state.cart = JSON.parse(cart)
    }

    console.log('Cart refreshed, store holds localStorage data:', state.cart)
  },
  ADD_TO_CART: (state, item) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart')) || []
    cart.push(item)
    localStorage.setItem('specteroCart', JSON.stringify(cart))
  },
  REMOVE_FROM_CART: (state, item) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart'))

    if (cart && cart.length) {
      console.log('found a cart', cart)
      const index = cart.find(i => i === item)

      if (index !== -1) {
        console.log('found an index', index)
        cart.splice(index, 1)
        localStorage.setItem('specteroCart', JSON.stringify(cart))
      }
    }
  },
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
