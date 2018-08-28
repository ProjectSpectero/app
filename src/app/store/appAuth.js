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
  user: (state) => {
    console.log('state.user', state.user)
    return state.user
  },
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  expiry: (state) => state.expiry,
  isImpersonating: (state) => state.impersonating,
  isAdmin: (state) => state.user && state.user.roles ? state.user.roles.indexOf('ADMIN') > -1 : false,
  isEnterprise: (state) => state.user && state.user.plans ? state.user.plans.indexOf('enterprise') > -1 : false,
  isPro: (state) => state.user && state.user.plans ? state.user.plans.indexOf('pro') > -1 : false,
  displayName: (state) => {
    if (state.user) {
      return state.user.fullName ? this.user.fullName : this.user.authKey
    }
    return '-'
  },
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
        console.log('calling syncCurrentUser', response.data.result)
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: error => {
        console.error(error)
      }
    })

    // Fetch support link, plans and cart data
    // await dispatch('settings/fetchSupportLink', null, { root: true })
    // await dispatch('market/fetchPlans', null, { root: true })
    // await dispatch('cart/refresh', null, { root: true })
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
    console.log('Checking login ...')
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
        console.log('checkLogin::setLoginInfo')
        await dispatch('setLoginInfo', data)

        console.log('checkLogin::syncCurrentUser')
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
    console.log('changed current user to', payload)
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
