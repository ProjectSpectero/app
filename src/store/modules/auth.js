import userAPI from '@/api/user.js'
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
  currentUser: (state) => state.user,
  currentUserRoles: (state) => state.user !== null ? state.user.roles : [],
  isSuperAdmin: (state, getters) => getters.currentUserRoles ? getters.currentUserRoles.indexOf('SuperAdmin') > -1 : false
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
    const cookie = getCookie(process.env.COOKIE_NAME)
    let data = null

    if (cookie) {
      // Access token found, no need to decode cookie
      if (getters.accessToken) {
        return true
      }

      data = JSON.parse(cookie)

      // If no data is set we're first-landing the page and
      // we'll need to decode the cookie and retrieve the current user
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
      expiry: 5
    }

    setCookie(process.env.COOKIE_NAME, JSON.stringify(data), { expires: 5 + 's' })
  },
  logout ({ commit }) {
    try {
      removeCookie(process.env.COOKIE_NAME)
      commit('CLEAR_LOGIN_INFO')
    } catch (err) {
      throw new Error(this.$i18n.t('errors.UNABLE_TO_LOGOUT'))
    }
  },
  setLoginInfo ({ commit, dispatch }, payload) {
    commit('SET_LOGIN_INFO', payload)
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
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
