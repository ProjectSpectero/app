<template>
  <div>
    <top title="Settings"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link :to="{ name: 'settings', params: { tab: 'profile' } }" class="filter-link">
          <span>Profile</span>
        </router-link>
        <router-link :to="{ name: 'settings', params: { tab: 'payment' } }" class="filter-link">
          <span>Payment Details</span>
        </router-link>
        <router-link :to="{ name: 'settings', params: { tab: 'keys' } }" class="filter-link">
          <span>Node Key</span>
        </router-link>
      </div>
      <div class="split-item split-details">
        <div v-if="currentTab === 'profile'"><tab-profile
          :user="user"
          :formError="formError"
          :formLoading="formLoading"
          @processForm="processForm">
        </tab-profile></div>

        <div v-if="currentTab === 'payment'"><tab-payment
          :user="user"
          :formError="formError"
          :formLoading="formLoading"
          @processForm="processForm">
        </tab-payment></div>

        <div v-if="currentTab === 'keys'"><tab-keys
          :user="user">
        </tab-keys></div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import { mapGetters } from 'vuex'
import userAPI from '@/app/api/user.js'
import tabProfile from './tabs/profile'
import tabPayment from './tabs/payment'
import tabKeys from './tabs/keys'

export default {
  components: {
    top,
    tabProfile,
    tabPayment,
    tabKeys
  },
  metaInfo: {
    title: 'Settings'
  },
  data () {
    return {
      formError: null,
      formLoading: false,
      form: null,
      nodeKey: null
    }
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.checkRouteTab()
  },
  watch: {
    '$route': 'checkRouteTab'
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      countries: 'settings/countries'
    }),
    currentTab: function () {
      return this.$route.params.tab
    }
  },
  methods: {
    checkRouteTab () {
      let allowed = ['profile', 'payment', 'keys']

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
    processForm (data) {
      this.formLoading = true

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
      this.$toasted.success('Your account has been updated successfully.')
      this.formLoading = false
    },
    dealWithError (err) {
      this.formLoading = false

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
