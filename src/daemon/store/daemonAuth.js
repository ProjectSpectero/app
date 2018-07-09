import { setCookie, removeCookie } from 'tiny-cookie'
import nodeAPI from '@/app/api/node'
import userAPI from '@/daemon/api/user'
import cloudAPI from '@/daemon/api/cloud'

const state = {
  specs: null,
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
  specs: (state) => state.specs,
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
  async syncCurrentUser ({ commit, dispatch }) {
    await userAPI.getMe({
      success: response => {
        commit('SET_CURRENT_USER', response.data.result)

        // Gather remote node details
        dispatch('connectToRemote')
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  async connectToRemote ({ commit, dispatch }) {
    await cloudAPI.remote({
      success: response => {
        commit('SET_SPECS', response.data.result)

        // Append the restart server button if needed
        if (response.data.result.app.restartNeeded) {
          dispatch('settings/switchBarComponent', 'restart', { root: true })
        }
      },
      fail: error => {
        const e = Object.keys(error.errors)[0]
        console.log('Unable to connect to remote node', error)
        throw new Error(e)
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
  },
  async autologin ({ commit, dispatch }, nodeId) {
    await nodeAPI.nodeLogin({
      data: {
        id: nodeId
      },
      success: response => {
        dispatch('addCookie', response.data.result)
        dispatch('setupEndpoint', response.data.result)
      },
      fail: error => {
        const e = Object.keys(error.errors)[0] || 'AUTOLOGIN_FAIL'
        console.log('Auto-login failed', error)
        throw new Error(e)
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
  },
  SET_SPECS (state, data) {
    console.log('System specs:', data)
    state.specs = data
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
