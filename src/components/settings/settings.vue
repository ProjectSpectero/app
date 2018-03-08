<template>
  <div>
    <top title="Settings"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link :to="{ name: 'settings', params: { tab: 'profile' } }" class="filter-link">
          <span>Profile</span>
        </router-link>
        <router-link :to="{ name: 'settings', params: { tab: 'security' } }" class="filter-link">
          <span>Security</span>
        </router-link>
        <router-link :to="{ name: 'settings', params: { tab: 'payment' } }" class="filter-link">
          <span>Payment Details</span>
        </router-link>
        <router-link :to="{ name: 'settings', params: { tab: 'keys' } }" class="filter-link">
          <span>Node Keys</span>
        </router-link>
      </div>
      <div class="split-item split-details">
        <div v-if="currentTab === 'profile'"><tab-profile
          :user="user"
          :formDisable="formDisable"
          @submitUserUpdate="submitUserUpdate">
        </tab-profile></div>

        <div v-if="currentTab === 'security'"><tab-security
          :user="user">
        </tab-security></div>

        <div v-if="currentTab === 'payment'"><tab-payment
          :user="user"
          :formDisable="formDisable"
          @submitUserUpdate="submitUserUpdate">
        </tab-payment></div>

        <div v-if="currentTab === 'keys'"><tab-keys
          :user="user">
        </tab-keys></div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import { mapGetters } from 'vuex'
import userAPI from '@/api/user.js'
import tabProfile from './tabs/profile'
import tabSecurity from './tabs/security'
import tabPayment from './tabs/payment'
import tabKeys from './tabs/keys'

export default {
  components: {
    top,
    tabProfile,
    tabSecurity,
    tabPayment,
    tabKeys
  },
  metaInfo: {
    title: 'Settings'
  },
  data () {
    return {
      formError: null,
      formDisable: false,
      form: null,
      nodeKey: null
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.user))
    this.checkRouteTab()
  },
  watch: {
    '$route': 'checkRouteTab'
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      countries: 'settings/countries'
    }),
    currentTab: function () {
      return this.$route.params.tab
    }
  },
  methods: {
    checkRouteTab () {
      let allowed = ['profile', 'security', 'payment', 'keys']

      // Redirect `/settings` to `/settings/profile`
      if (this.currentTab === undefined) {
        this.$router.push({ name: 'settings', params: { tab: 'profile' } })
        return
      }

      // 404 redirect if tab key is invalid
      if ((allowed.indexOf(this.currentTab) > -1) === false) {
        this.error404()
      }
    },
    submitUserUpdate (data) {
      this.processForm(data)
    },
    // regenerateNodeKey () {
    //   userAPI.regenerateNodeKey({
    //     success: response => {
    //       this.nodeKey = response.data.result.node_key
    //     },
    //     fail: error => {
    //       console.log('Unable to regenerate node key', error)
    //     }
    //   })
    // },
    processForm (data) {
      // Remove empty fields from the list
      for (var key in data) {
        if (data[key] === null || data[key] === '') {
          delete data[key]
        }
      }

      userAPI.edit({
        data: data,
        success: response => {
          this.dealWithSuccess()
        },
        fail: error => {
          this.dealWithError(error)
        }
      })
    },
    dealWithSuccess () {
      this.$toasted.show('Your profile has been updated successfully!')
      this.formDisable = false
    },
    dealWithError (err) {
      this.formDisable = false

      // Get first error key to display main error msg
      for (var errorKey in err.errors) {
        if (err.errors.hasOwnProperty(errorKey)) {
          this.formError = this.$i18n.t(`errors.${errorKey}`)
          break
        }
      }

      // Inject errors into form fields
      for (let inputName in err.fields) {
        if (err.fields.hasOwnProperty(inputName)) {
          let inputErrors = err.fields[inputName]
          console.log(inputErrors)
          for (let errorKey in inputErrors) {
            if (inputErrors.hasOwnProperty(errorKey)) {
              this.$validator.errors.add(inputName, this.$i18n.t(`errors.${errorKey}`, null, { x: inputErrors[errorKey] }))
            }
          }
        }
      }
    },
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
