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
      success: response => {
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: e => {
        console.error('DAEMON: Unable to sync user')
      }
    })

    // Gather remote node details
    await dispatch('connectToRemote')
  },
  async connectToRemote ({ commit, dispatch }) {
    await cloudAPI.remote({
      success: response => {
        console.warn('DAEMON: Finished connecting to remote', response.data.result)
        commit('SET_SPECS', response.data.result)

        // Append the restart server button if needed
        if (response.data.result.app.restartNeeded) {
          dispatch('settings/switchBarComponent', 'restart', { root: true })
        }
      },
      fail: e => {
        console.error('DAEMON: Unable to connect to remote node')
      }
    })
  },
  async testLogin ({ state, dispatch }) {
    if (state.user && getCookie(process.env.VUE_APP_DAEMON_COOKIE) === null) {
      console.warn('DAEMON: login test failed, calling autologin() ...')
      await dispatch('autologin')
    } else {
      console.warn('DAEMON: login test passed, proceeding ...')
    }
  },
  async addCookie ({ commit }, payload) {
    const data = {
      accessToken: payload.credentials.access.token,
      refreshToken: payload.credentials.refresh.token,
      accessTokenExpires: payload.credentials.access.expires,
      refreshTokenExpires: payload.credentials.refresh.expires
    }

    // setCookie(process.env.VUE_APP_DAEMON_COOKIE, JSON.stringify(data), { expires: '20s' })
    setCookie(process.env.VUE_APP_DAEMON_COOKIE, JSON.stringify(data), { expires: parseFloat(payload.credentials.access.expires / 1000) + 's' })
  },
  setupEndpoint ({ commit }, payload) {
    commit('SETUP_ENDPOINT', payload)
  },
  async setupNode ({ commit }, id) {
    await nodeAPI.node({
      data: {
        id: id
      },
      success: async response => {
        if (response.data.result) {
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
    let details = null

    if (nodeId) {
      await nodeAPI.nodeLogin({
        data: {
          id: nodeId
        },
        success: response => {
          details = response.data.result
        },
        fail: e => {
          console.error('DAEMON: Auto-login failed')
          router.push({ name: 'nodes' })
        }
      })

      if (details) {
        console.warn('DAEMON: Auto-login started, setting up daemon data')
        await dispatch('addCookie', details)
        await dispatch('setupEndpoint', details)
        await dispatch('setupNode', nodeId)
        await dispatch('syncCurrentUser')
      } else {
        router.push({ name: 'nodes' })
      }
    } else {
      router.push({ name: 'nodes' })
    }
  },
  logout ({ commit }) {
    removeCookie(process.env.VUE_APP_DAEMON_COOKIE)
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
