import userAPI from '../../api/user.js'
import { setCookie, getCookie, removeCookie } from 'tiny-cookie'

const state = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiry: null
}

const getters = {
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  expiry: (state) => state.expiry,
  currentUser: (state) => state.user,
  currentUserRoles: (state) => state.user !== null ? state.user.roles : [],
  isSuperAdmin: (state, getters) => getters.currentUserRoles ? getters.currentUserRoles.indexOf('SuperAdmin') > -1 : false
}

const actions = {
  syncCurrentUser ({ commit }) {
    userAPI.get({
      data: { id: state.user.id },
      success: (response) => {
        commit('SET_CURRENT_USER', response.data.result)
      },
      fail: (error) => {
        console.log(error)
        // TODO: implement
      }
    })
  },
  checkLogin ({ commit, getters }) {
    const c = getCookie('SPECTERO_AUTH')
    console.log('at checkLogin')
    if (c) {
      console.log('Found right cookie')

      if (getters.accessToken) {
        console.log('Found accessToken so no need to parse cookie')
        return true
      }

      const data = JSON.parse(c)

      if (data) {
        console.log('On checkLogin, parsed cookie', data)
        commit('SET_LOGIN_INFO', data)
        return true
      }
    }

    return false
  },
  addCookie ({ commit }, payload) {
    const data = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiry: payload.expiry
    }

    setCookie('SPECTERO_AUTH', JSON.stringify(data), { expires: payload.expiry + 's' })
  },
  logout ({ commit }) {
    try {
      removeCookie('SPECTERO_AUTH')
    } catch (err) {
      throw new Error(this.$i18n.t('errors.UNABLE_TO_LOGOUT'))
    }

    commit('CLEAR_LOGIN_INFO')
    console.log('Logged out.')
  },
  setLoginInfo ({ commit }, payload) {
    commit('SET_LOGIN_INFO', payload)
  }
}

const mutations = {
  SET_CURRENT_USER (state, payload) {
    state.user = payload
  },
  SET_LOGIN_INFO (state, payload) {
    console.log('accessToken', payload.accessToken)
    console.log('refreshToken', payload.refreshToken)
    console.log('expiry', payload.expiry)

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
