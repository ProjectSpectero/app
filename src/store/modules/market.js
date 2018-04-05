import marketAPI from '@/api/market.js'

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
  results: (state) => state.results,
  totals: (state) => {
    const cart = state.cart

    let totals = {
      total: 0,
      nodes: 0,
      nodeGroups: 0
    }

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i]
      let price = parseInt(item.price)

      totals.total += price
      totals[(item.type === 'NODE_GROUP') ? 'nodeGroups' : 'nodes'] += price
    }

    return totals
  }
}

const actions = {
  async fetch ({ getters, commit }, data) {
    await marketAPI.search({
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
  clearCart: ({ commit }) => {
    commit('CLEAR_CART')
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
  REFRESH_CART: (state) => {
    const cart = localStorage.getItem('specteroCart')

    if (cart) {
      state.cart = JSON.parse(cart)
    }
  },
  ADD_TO_CART: (state, item) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart')) || []
    cart.push(item)
    localStorage.setItem('specteroCart', JSON.stringify(cart))
  },
  REMOVE_FROM_CART: (state, item) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart'))

    if (cart && cart.length) {
      // Gets index of cart item from cart array based on item.id
      let index = -1
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === item.id) {
          index = i
          break
        }
      }

      if (index !== -1) {
        cart.splice(index, 1)
        localStorage.setItem('specteroCart', JSON.stringify(cart))
      }
    }
  },
  CLEAR_CART: (state) => {
    localStorage.removeItem('specteroCart')
    state.cart = []
  },
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
