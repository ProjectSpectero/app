import Vue from 'vue'
import marketAPI from '@/app/api/market.js'

const state = {
  cart: [],
  locked: false,
  initialized: false
}

const localCartKey = 'SPECTERO_CART'

const getLocalData = () => {
  let cart = localStorage.getItem(localCartKey)
  return (cart) ? JSON.parse(cart) : {cart: [], locked: false}
}

const setLocalCart = (data, locked) => {
  let store = {
    cart: (data !== undefined) ? data : state.cart,
    locked: (locked !== undefined) ? locked : state.locked
  }
  localStorage.setItem(localCartKey, JSON.stringify(store))
}

const getters = {
  cart: (state) => state.cart,
  itemCount: (state) => state.cart.length,
  empty: (state) => state.cart.length === 0,
  locked: (state) => state.locked,
  getItem: (state) => (id, type) => {
    let itemIndex = state.cart.findIndex(i => { return (i.id === id && i.type === type) })
    return (itemIndex !== -1) ? state.cart[itemIndex] : null
  },
  totals: (state) => {
    let totals = {
      total: 0,
      type: {
        node: 0,
        group: 0
      },
      cycle: {
        monthly: 0,
        yearly: 0
      }
    }

    state.cart.forEach((item) => {
      const price = (item.pricing !== undefined) ? item.pricing[(item.term === 'YEARLY') ? 'yearly' : 'monthly'] : {}

      totals.total += price
      totals.type[item.type === 'NODE_GROUP' ? 'group' : 'node'] += price
      totals.cycle[item.term.toLowerCase()] += price
    })

    return totals
  }
}

const actions = {
  // Parse items from localCart and fetch updated data from API
  refresh: ({ commit, state, dispatch }) => {
    let localCart = getLocalData().cart

    // Parse items from localCart and fetch updated data from API
    if (localCart) {
      for (let i = 0; i < localCart.length; i++) {
        dispatch('loadItem', localCart[i])
      }
      commit('LOCK', getLocalData().locked)
    }

    commit('INITIALIZE')
  },

  // Loads given item data from API into store
  loadItem: ({ commit, state, dispatch, rootGetters }, item) => {
    // Check the store to see if this item has already been loaded previously
    const found = state.cart.find(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (found && found.loaded) {
      // console.warn(`Cart item ${found.id} (${found.type}) has already been loaded from API.`)
      return false
    }

    marketAPI.fetch({
      data: {
        id: item.id,
        type: item.type === 'NODE_GROUP' ? 'group' : 'node'
      },
      success: response => {
        let plan = item.plan ? rootGetters['market/plan'](item.plan) : null

        item.loaded = true

        item.data = response.data.result
        item.data.price = parseFloat(item.data.price)

        // Calculate monthly/yearly pricing
        let pricing = {
          monthly: item.data.price,
          yearly: item.plan ? (item.data.price / 30) * 365 : null
        }

        // Yearly discount pricing
        if (item.plan && plan.yearly_discount_pct) {
          pricing.yearlyDiscount = plan.yearly_discount_pct
          pricing.yearlySavings = pricing.yearly * plan.yearly_discount_pct
          pricing.yearly = Math.floor(pricing.yearly - pricing.yearlySavings) // floor the price for marketing purposes
        }

        item.pricing = pricing
        item.price = pricing[item.term.toLowerCase()]

        commit('ADD_ITEM', item)
      },
      fail: (e) => {
        console.warn(`Error fetching cart item ${item.type} ID ${item.id}:`, e)

        // Remove item from cart if 403 unauthorized or 404 not found
        if (e.status === 403 || e.status === 404) {
          console.warn(`Removing cart item ${item.type} ID ${item.id} (${e.status})`)
          dispatch('remove', item)
        }
      }
    })
  },
  add: ({ commit, state, dispatch }, item) => {
    let localCart = getLocalData().cart

    const localCartIndex = localCart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    // Same item can't be added twice to localStorage
    if (localCartIndex !== -1) {
      throw new Error('ITEM_ALREADY_IN_CART')
    }

    // Don't allow addition if cart is locked
    if (state.locked) {
      throw new Error('CART_MUST_BE_EMPTY')
    }

    // Items with plan requirements:
    //  1) You may not add an item with plan if the cart isn't empty
    //  2) If you have an item with plan in cart, you may not add any further items
    if (item.plan && state.cart.length !== 0) {
      throw new Error('CART_MUST_BE_EMPTY')
    }

    // If adding an item with plan, lock the cart so no further items may be added
    if (item.plan) {
      dispatch('lock', true)
    }

    item.loaded = false
    item.data = {}

    localCart.push(item)
    setLocalCart(localCart)

    commit('ADD_ITEM', item)
    dispatch('refresh')
  },
  remove: ({ commit }, item) => {
    commit('REMOVE', item)

    // Remove from localStorage
    let localCart = getLocalData().cart

    const localCartIndex = localCart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (localCartIndex === -1) {
      throw new Error('ITEM_DOESNT_EXIST')
    }

    localCart.splice(localCartIndex, 1)

    setLocalCart(localCart, false)
  },
  changeTerm: ({ commit }, item) => {
    commit('CHANGE_TERM', item)

    // Change in localStorage
    let localCart = getLocalData().cart

    const localCartIndex = localCart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (localCartIndex === -1) {
      throw new Error('ITEM_DOESNT_EXIST')
    }

    localCart[localCartIndex].term = item.term.toUpperCase()
    setLocalCart(localCart)
  },
  clear: ({ commit }) => {
    commit('CLEAR')
    localStorage.removeItem(localCartKey)
  },
  lock: ({ commit }, locked) => {
    locked = (locked !== undefined) ? locked : true

    commit('LOCK', locked)
    setLocalCart(undefined, locked)
  }
}

const mutations = {
  INITIALIZE: (state) => {
    state.initialized = true
  },
  ADD_ITEM: (state, item) => {
    const foundIndex = state.cart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (foundIndex !== -1) {
      Vue.set(state.cart, foundIndex, item)
    } else {
      state.cart.push(item)
    }
  },
  REMOVE: (state, item) => {
    // Remove from state
    const cartIndex = state.cart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (cartIndex !== -1) {
      state.cart.splice(cartIndex, 1)

      // If we're removing an item from cart, assume we're unlocking it
      state.locked = false
    }
  },
  CHANGE_TERM: (state, item) => {
    const cartIndex = state.cart.findIndex(i => {
      return (i.id === item.id && i.type === item.type)
    })

    if (cartIndex !== -1) {
      state.cart[cartIndex].term = item.term
    }
  },
  CLEAR: (state) => {
    state.cart = []
    state.locked = false
  },
  LOCK: (state, locked) => {
    state.locked = locked
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
