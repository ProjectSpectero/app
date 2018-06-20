import userAPI from '@/app/api/user'
import { setCookie, getCookie, removeCookie } from 'tiny-cookie'

const state = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiry: null
}

const getters = {
  user: (state) => state.user,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  expiry: (state) => state.expiry,
  isEnterprise: (state) => state.user && state.user.plans ? state.user.plans.indexOf('enterprise') > -1 : false,
  isPro: (state) => state.user && state.user.plans ? state.user.plans.indexOf('pro') > -1 : false
}

const actions = {
  async syncCurrentUser ({ commit }) {
    await userAPI.getMe({
      success: response => {
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  async checkLogin ({ commit, getters, dispatch }) {
    const cookie = getCookie(process.env.APP_COOKIE)
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
        commit('SET_LOGIN_INFO', data)
        await dispatch('syncCurrentUser')
        return true
      }
    }

    return false
  },
  storeUser ({ commit }, user) {
    commit('SET_CURRENT_USER', user)
  },
  addCookie ({ commit }, payload) {
    const data = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiry: payload.expiry
    }

    setCookie(process.env.APP_COOKIE, JSON.stringify(data), { expires: payload.expiry + 's' })
  },
  logout ({ commit }) {
    removeCookie(process.env.APP_COOKIE)
    commit('CLEAR_LOGIN_INFO')
  },
  setLoginInfo ({ commit, dispatch }, payload) {
    commit('SET_LOGIN_INFO', payload)
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
    console.log(state.user)
  },
  SET_LOGIN_INFO (state, payload) {
    state.accessToken = payload.accessToken
    state.refreshToken = payload.refreshToken
    state.expiry = payload.expiry
  },
  CLEAR_LOGIN_INFO (state) {
    state.accessToken = null
    state.refreshToken = null
    state.expiry = null
    state.user = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
