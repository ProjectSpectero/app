import marketAPI from '@/api/app/market.js'

const state = {
  cart: [],
  results: [],
  pagination: null,
  filters: [],
  grouped: true,
  buttonEnabled: false,
  plans: null
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
      nodeGroups: 0,
      monthly: 0,
      yearly: 0
    }

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i]
      let price = parseInt(item.price)

      totals.total += price
      totals[item.term] += price
      totals[(item.type === 'NODE_GROUP') ? 'nodeGroups' : 'nodes'] += price
    }

    return totals
  },
  checkIfInCart: state => (id) => {
    if (!state.cart.length) {
      return false
    }
    for (let i = 0; i < state.cart.length; i++) {
      if (state.cart[i].id === id) {
        return state.cart[i]
      }
    }
    return false
  },
  plan: state => (planId) => {
    if (!planId) {
      return null
    }
    let plan = state.plans[planId]
    plan.id = planId
    return plan
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
  refreshCart: ({ commit }) => {
    commit('REFRESH_CART')
  },
  addToCart: ({ commit }, data) => {
    commit('ADD_TO_CART', data)
    commit('REFRESH_CART')
  },
  removeFromCart: ({ commit }, item) => {
    commit('REMOVE_FROM_CART', item)
    commit('REFRESH_CART')
  },
  changeTerm: ({ commit }, data) => {
    commit('CHANGE_TERM', data)
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
    let cart = localStorage.getItem('specteroCart')

    if (cart) {
      cart = JSON.parse(cart)

      // Calculate term pricing for each item
      for (let i = 0; i < cart.length; i++) {
        let item = cart[i]

        // Convert item.price from String to Float for future math operations
        item.price = parseFloat(cart[i].price)

        // Note: `yearly` value has yearlyDiscount applied to it (if any % is set with plan)
        let pricing = {
          monthly: item.price,
          yearly: (item.plan) ? item.price * 12 : null,
          yearlyDiscount: (item.plan && item.plan.yearly_discount_pct) ? item.plan.yearly_discount_pct : null,
          yearlySavings: null // Set below
        }

        // Apply discount if plan is set w/ discount
        if (pricing.yearlyDiscount) {
          pricing.yearlySavings = pricing.yearly * item.plan.yearly_discount_pct
          pricing.yearly -= pricing.yearlySavings
        }

        item.pricing = pricing
        item.price = pricing[item.term]
      }

      state.cart = cart
    }
  },
  ADD_TO_CART: (state, data) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart')) || []
    let item = {}

    // Copy fields from `item` object
    let copyFields = [
      'id',
      'friendly_name',
      'market_model',
      'plan',
      'price',
      'status',
      'type'
    ]
    for (let i = 0; i < copyFields.length; i++) {
      item[copyFields[i]] = data.item[copyFields[i]]
    }

    item.plan = data.plan
    item.term = data.term

    cart.push(item)
    localStorage.setItem('specteroCart', JSON.stringify(cart))
  },
  REMOVE_FROM_CART: (state, itemId) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart'))

    if (cart && cart.length) {
      // Gets index of cart item from cart array based on item id
      let index = -1
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
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
  CHANGE_TERM: (state, data) => {
    let cart = JSON.parse(localStorage.getItem('specteroCart'))

    if (cart && cart.length) {
      // Gets index of cart item from cart array based on item id
      let index = -1
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === data.item.id) {
          index = i
          break
        }
      }

      if (index !== -1) {
        cart[index].term = data.term
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
