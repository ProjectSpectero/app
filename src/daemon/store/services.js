import serviceAPI from '@/daemon/api/service'

const state = {
  services: null
}

const getters = {
  services: state => state.services
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
  }
}

const mutations = {
  UPDATE_SERVICES_LIST: (state, services) => {
    state.services = services
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
