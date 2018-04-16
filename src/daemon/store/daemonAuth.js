import { setCookie, getCookie, removeCookie } from 'tiny-cookie'
import nodeAPI from '@/app/api/node.js'
import userAPI from '@/daemon/api/user.js'
import router from '@/router'

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
  expiry: (state) => state.expiry
}

const actions = {
  async syncCurrentUser ({ commit }) {
    await userAPI.getMe({
      success: response => {
        console.log('syncCurrentUser response', response.data.result)
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  async addCookie ({ commit, dispatch }, payload) {
    const data = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiry: 604800 // 7 days
    }

    setCookie(process.env.DAEMON_COOKIE, JSON.stringify(data), { expires: payload.expiry + 's' })
    commit('SET_LOGIN_INFO', data)

    console.log('Added cookie info for DAEMON_COOKIE', getCookie(process.env.DAEMON_COOKIE))
  },
  async autologin ({ commit, dispatch }, nodeId) {
    await nodeAPI.nodeLogin({
      data: {
        id: nodeId
      },
      success: response => {
        dispatch('addCookie', response.data.result)
      },
      fail: error => {
        console.log(error)
        router.push({ path: '/404' })
      }
    })
  },
  logout ({ commit }) {
    removeCookie(process.env.DAEMON_COOKIE)
    commit('CLEAR_LOGIN_INFO')
  },
  checkLogin ({ state, commit, dispatch }) {
    const cookie = getCookie(process.env.DAEMON_COOKIE)
    let data = null

    if (cookie) {
      // Access token found, no need to decode cookie
      if (state.accessToken) {
        return
      }

      data = JSON.parse(cookie)

      // If no data is set we're first-landing the page and we need to decode the cookie
      if (data) {
        commit('SET_LOGIN_INFO', data)
      }
    } else {
      dispatch('autologin', router.params.nodeId)
    }
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
    console.log('Fetched current user', state.user)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
