import serviceAPI from '../../api/service.js'

const state = {
  services: null,
  ips: null
}

const getters = {
  services: state => state.services,
  ips: state => state.ips
}

const actions = {
  fetch: ({ commit }) => {
    serviceAPI.list({
      success: response => {
        commit('UPDATE_SERVICES_LIST', response.data.result)
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  toggleStatus: ({ dispatch }, options) => {
    serviceAPI.manage({
      name: options.service,
      action: options.action,
      success: response => {
        dispatch('fetch')
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  fetchIps: ({ commit }) => {
    serviceAPI.ips({
      success: response => {
        commit('UPDATE_IP_LIST', response.data.result)
      },
      fail: error => {
        console.log(error)
      }
    })
  }
}

const mutations = {
  UPDATE_SERVICES_LIST: (state, services) => {
    state.services = services
  },

  UPDATE_IP_LIST: (state, ips) => {
    state.ips = ips
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
