import { setCookie, getCookie, removeCookie } from 'tiny-cookie'
import nodeAPI from '@/app/api/node.js'
import userAPI from '@/daemon/api/user.js'

const state = {
  initialized: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpires: null,
  refreshTokenExpires: null,
  ip: null,
  port: null,
  protocol: 'http',
  version: 'v1'
}

const getters = {
  initialized: (state) => state.initialized,
  user: (state) => state.user,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  accessTokenExpires: (state) => state.accessTokenExpires,
  refreshTokenExpires: (state) => state.refreshTokenExpires,
  ip: (state) => state.ip,
  port: (state) => state.port,
  protocol: (state) => state.protocol,
  version: (state) => state.version
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
      accessToken: payload.credentials.access.token,
      refreshToken: payload.credentials.refresh.token,
      accessTokenExpires: payload.credentials.access.expires,
      refreshTokenExpires: payload.credentials.refresh.expires
    }

    setCookie(process.env.DAEMON_COOKIE, JSON.stringify(data), { expires: parseFloat(payload.credentials.access.expires / 1000) + 's' })
    console.log('Added cookie info for DAEMON_COOKIE', getCookie(process.env.DAEMON_COOKIE))
  },
  async autologin ({ commit, dispatch }, nodeId) {
    await nodeAPI.nodeLogin({
      data: {
        id: nodeId
      },
      success: response => {
        console.log('autologin success')
        dispatch('addCookie', response.data.result)
        dispatch('setupEndpoint', response.data.result)
      },
      fail: error => {
        console.error('autologin error', error)
        throw new Error('AUTOLOGIN_FAIL')
      }
    })
  },
  setupEndpoint ({ commit }, payload) {
    commit('SETUP_ENDPOINT', payload)
  },
  logout ({ commit }) {
    removeCookie(process.env.DAEMON_COOKIE)
    commit('CLEAR_ENDPOINT')
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
    console.log('Fetched current user', state.user)
  },
  SETUP_ENDPOINT (state, payload) {
    state.initialized = true
    state.accessToken = payload.credentials.access.token
    state.refreshToken = payload.credentials.refresh.token
    state.accessTokenExpires = payload.credentials.access.expires
    state.refreshTokenExpires = payload.credentials.refresh.expires
    state.protocol = payload.meta.protocol
    state.ip = payload.meta.ip
    state.port = payload.meta.port
    state.version = payload.meta.apiVersion
  },
  CLEAR_ENDPOINT (state) {
    state.accessToken = null
    state.refreshToken = null
    state.accessTokenExpires = null
    state.refreshTokenExpires = null
    state.ip = null
    state.port = null
    state.protocol = 'http'
    state.version = 'v1'
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
