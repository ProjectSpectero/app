import countries from '@/shared/helpers/countries'
import userAPI from '@/app/api/user'

const state = {
  countries: countries,
  layout: 'master',
  bar: null,
  supportLink: null
}

const getters = {
  layout: (state) => state.layout,
  countries: (state) => state.countries,
  bar: (state) => state.bar,
  supportLink: (state) => state.supportLink
}

const actions = {
  switchLayout: ({ commit }, layout) => {
    commit('SWITCH_LAYOUT', layout || 'master')
  },
  switchBarComponent: ({ commit }, component) => {
    commit('SWITCH_BAR_COMPONENT', component)
  },
  removeBarComponent: ({ commit }) => {
    commit('REMOVE_BAR_COMPONENT')
  },
  async fetchSupportLink ({ commit }) {
    let link = 'mailto:support@spectero.freshdesk.com'

    await userAPI.getSupportLink({
      success: response => {
        if (response.data.result && response.data.result.redirect_uri !== undefined) {
          link = response.data.result.redirect_uri
        }
      },
      overrideErrors: true
    })

    commit('SET_SUPPORT_LINK', link)
  }
}

const mutations = {
  SWITCH_LAYOUT: (state, layout) => {
    state.layout = layout
  },
  SET_SUPPORT_LINK: (state, link) => {
    state.supportLink = link
  },
  SWITCH_BAR_COMPONENT: (state, component) => {
    state.bar = component
    localStorage.setItem('specteroBar', state.bar)
  },
  REMOVE_BAR_COMPONENT: (state, component) => {
    state.bar = null
    localStorage.removeItem('specteroBar')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
