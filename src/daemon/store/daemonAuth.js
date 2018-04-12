import { setCookie, getCookie, removeCookie } from 'tiny-cookie'
import nodeAPI from '@/app/api/node.js'
import router from '@/router'

const state = {
  accessToken: null,
  refreshToken: null,
  expiry: null
}

const getters = {
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  expiry: (state) => state.expiry
}

const actions = {
  addCookie ({ commit }, payload) {
    const data = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiry: 604800 // 7 days
    }

    console.log('data', data)

    setCookie(process.env.DAEMON_COOKIE, JSON.stringify(data), { expires: payload.expiry + 's' })
    console.log('Added cookie info for DAEMON_COOKIE', getCookie(process.env.DAEMON_COOKIE))
  },
  async autologin ({ commit, dispatch }, nodeId) {
    await nodeAPI.nodeLogin({
      data: {
        id: nodeId
      },
      success: response => {
        dispatch('addCookie', response.data.result)
        commit('SET_LOGIN_INFO', response.data.result)
        router.push({ name: 'daemon', params: { nodeId: nodeId } })
      },
      fail: error => {
        console.log(error)
        router.push({ path: '/404' })
      }
    })
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
      if (router.params.nodeId) {
        dispatch('autologin', router.params.nodeId)
      } else {
        router.push({ name: 'nodes' })
      }
    }
  },
  logout ({ commit }) {
    removeCookie(process.env.DAEMON_COOKIE)
    commit('CLEAR_LOGIN_INFO')
  }
}

const mutations = {
  SET_LOGIN_INFO (state, payload) {
    state.accessToken = payload.accessToken
    state.refreshToken = payload.refreshToken
    state.expiry = 604800 // 7 days
    console.log('Set login info for daemon in store', state.accessToken)
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
