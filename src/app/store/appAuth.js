import userAPI from '@/app/api/user'
import { getCookie, setCookie, removeCookie } from 'tiny-cookie'

const state = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiry: null,
  impersonating: false
}

const getters = {
  user: (state) => state.user,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  expiry: (state) => state.expiry,
  isImpersonating: (state) => state.impersonating,
  isAdmin: (state) => state.user && state.user.roles ? state.user.roles.indexOf('ADMIN') > -1 : false,
  isEnterprise: (state) => state.user && state.user.plans ? state.user.plans.indexOf('enterprise') > -1 : false,
  isPro: (state) => state.user && state.user.plans ? state.user.plans.indexOf('pro') > -1 : false,
  displayName: (state) => state.user ? (state.user.fullName ? this.user.fullName : this.user.authKey) : '-',
  initials: (state) => {
    let displayName = (state.user.name) ? state.user.name : state.user.email
    const initials = displayName.match(/\b\w/g) || []
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  }
}

const actions = {
  async syncCurrentUser ({ commit, dispatch }) {
    await userAPI.getMe({
      success: response => {
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: e => {
        console.error('Unable to sync current user')
      }
    })

    // Fetch support link, plans and cart data
    dispatch('settings/fetchSupportLink', null, { root: true })
    dispatch('market/fetchPlans', null, { root: true })
    dispatch('cart/refresh', null, { root: true })
  },
  async syncImpersonatedUser ({ commit }, id) {
    await userAPI.getMe({
      data: { id: id },
      success: response => {
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: error => {
        console.error(error)
      }
    })
  },
  async checkLogin ({ getters, dispatch }) {
    const cookie = getCookie(process.env.VUE_APP_COOKIE)
    let data = null

    if (cookie) {
      // Access token found, no need to decode cookie
      if (getters.accessToken) {
        return true
      }

      data = JSON.parse(cookie)

      // If no data is set we're first-landing the page and
      // we'll need to decode the cookie,retrieve the current user
      if (data) {
        await dispatch('setLoginInfo', data)
        await dispatch('syncCurrentUser')
        return true
      }
    }

    return false
  },
  addCookie ({ commit }, payload) {
    let cookieName = process.env.VUE_APP_COOKIE
    const data = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiry: payload.expiry
    }

    // Check if we're adding a custom cookie, otherwise use process.env.VUE_APP_COOKIE
    // (default cookie for login)
    if (payload.cookieName !== undefined && payload.cookieName) {
      cookieName = payload.cookieName
    }

    setCookie(cookieName, JSON.stringify(data), { expires: payload.expiry + 's' })
  },
  logout ({ commit }) {
    removeCookie(process.env.VUE_APP_COOKIE)
    removeCookie(process.env.VUE_APP_IMPERSONATE_COOKIE)
    commit('CLEAR_LOGIN_INFO')
  },
  setLoginInfo ({ commit }, payload) {
    commit('SET_LOGIN_INFO', payload)
  },
  async startImpersonating ({ commit }) {
    commit('START_IMPERSONATION')
  },
  async stopImpersonating ({ commit }) {
    // Remove impersonation cookie (we don't need it and
    // it acts as a validator for being impersonating or not)
    commit('STOP_IMPERSONATION')
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
  },
  SET_LOGIN_INFO (state, payload) {
    state.accessToken = payload.accessToken
    state.refreshToken = payload.refreshToken || null
    state.expiry = payload.expiry
  },
  CLEAR_LOGIN_INFO (state) {
    state.accessToken = null
    state.refreshToken = null
    state.expiry = null
    state.user = null
    state.impersonating = false
  },
  START_IMPERSONATION (state) {
    state.impersonating = true
  },
  STOP_IMPERSONATION (state) {
    state.impersonating = false
    removeCookie(process.env.VUE_APP_IMPERSONATE_COOKIE)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
