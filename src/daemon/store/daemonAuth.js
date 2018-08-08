import { setCookie, getCookie, removeCookie } from 'tiny-cookie'
import userAPI from '@/daemon/api/user'
import cloudAPI from '@/daemon/api/cloud'
import nodeAPI from '@/app/api/node'
import router from '@/router'

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
  version: 'v1',
  node: null
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
  version: (state) => state.version,
  node: (state) => state.node
}

const actions = {
  async syncCurrentUser ({ commit, dispatch }) {
    await userAPI.getMe({
      success: async response => {
        console.log('Retrieved user information (syncCurrentUser)', response.data.result)
        commit('SET_CURRENT_USER', response.data.result)

        // Gather remote node details
        await dispatch('connectToRemote')
      },
      fail: error => {
        console.error(error)
      }
    })
  },
  async connectToRemote ({ commit, dispatch }) {
    await cloudAPI.remote({
      success: response => {
        console.warn('Finished connecting to remote', response.data.result)
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
  async testLogin ({ state, dispatch }) {
    if (state.user && getCookie(process.env.DAEMON_COOKIE) === null) {
      console.warn('Daemon login test failed, calling autologin() ...')
      await dispatch('autologin')
    } else {
      console.warn('Daemon login test passed, proceeding ...')
    }
  },
  async addCookie ({ commit }, payload) {
    const data = {
      accessToken: payload.credentials.access.token,
      refreshToken: payload.credentials.refresh.token,
      accessTokenExpires: payload.credentials.access.expires,
      refreshTokenExpires: payload.credentials.refresh.expires
    }

    setCookie(process.env.DAEMON_COOKIE, JSON.stringify(data), { expires: '10s' })
    // setCookie(process.env.DAEMON_COOKIE, JSON.stringify(data), { expires: parseFloat(payload.credentials.access.expires / 1000) + 's' })
    console.log('Finished adding cookie with data')
  },
  setupEndpoint ({ commit }, payload) {
    console.log('Setting up endpoint', payload)
    commit('SETUP_ENDPOINT', payload)
  },
  async setupNode ({ commit }, id) {
    await nodeAPI.node({
      data: {
        id: id
      },
      success: async response => {
        if (response.data.result) {
          console.log('Finished setting up node', response.data.result)
          commit('SETUP_NODE', response.data.result)
        }
      },
      fail: (e) => {
        console.log(e)
        this.$toasted.error('nodes.RESOURCE_NOT_FOUND')
      }
    })
  },
  async autologin ({ dispatch }) {
    const nodeId = router.currentRoute.params.nodeId

    if (nodeId) {
      await nodeAPI.nodeLogin({
        data: {
          id: nodeId
        },
        success: async response => {
          console.warn('Auto-login started, setting up daemon data', response.data.result)
          await dispatch('addCookie', response.data.result)
          await dispatch('setupEndpoint', response.data.result)
          await dispatch('setupNode', nodeId)
          await dispatch('syncCurrentUser')
        },
        fail: error => {
          console.error('Auto-login failed', error)
          router.push({ name: 'nodes' })
          const e = Object.keys(error.errors)[0] || 'AUTOLOGIN_FAIL'
          throw new Error(e)
        }
      })
    } else {
      router.push({ name: 'nodes' })
    }
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
  SETUP_NODE (state, node) {
    state.node = node
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
    state.node = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
