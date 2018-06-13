<template>
  <div>
    <top title="Settings"/>
    <div class="container">
      <div class="col-12 content-split">
        <div class="split-list">
          <router-link
            :to="{ name: 'settings', params: { tab: 'profile' } }"
            class="filter-link">
            Profile
          </router-link>
          <router-link
            :to="{ name: 'settings', params: { tab: 'payment' } }"
            class="filter-link">
            Payment Details
          </router-link>
          <router-link
            :to="{ name: 'settings', params: { tab: 'keys' } }"
            class="filter-link">
            Node Key
          </router-link>
        </div>
        <div class="split-details">
          <div class="section padded">
            <tab-profile
              v-if="currentTab === 'profile'"
              :user="user"
              :form-error="formError"
              :form-loading="formLoading"
              @processForm="processForm"/>

            <tab-payment
              v-if="currentTab === 'payment'"
              :user="user"
              :form-error="formError"
              :form-loading="formLoading"
              @processForm="processForm"/>

            <tab-keys
              v-if="currentTab === 'keys'"
              :user="user"/>
          </div>
        </div>
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
      formError: '',
      formLoading: false,
      form: null,
      nodeKey: null
    }
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
  watch: {
    '$route': 'checkRouteTab'
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.checkRouteTab()
  },
  methods: {
    checkRouteTab () {
      let allowed = ['profile', 'payment', 'keys']

      if (this.currentTab === undefined || (allowed.indexOf(this.currentTab) > -1) === false) {
        this.$router.push({ name: 'settings', params: { tab: 'profile' } })
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
