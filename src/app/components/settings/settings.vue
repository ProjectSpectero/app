<template>
  <div>
    <top title="Settings">
      <ul
        slot="tabs"
        class="tabs tabs-linked-list">
        <li>
          <router-link :to="{ name: 'settings', params: { tab: 'account' } }">
            My Account
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'settings', params: { tab: 'payment' } }">
            Payment Details
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'settings', params: { tab: 'keys' } }">
            Node Key
          </router-link>
        </li>
      </ul>
    </top>
    <div class="container">
      <div class="col-12">
        <div class="section">
          <tab-account
            v-if="currentTab === 'account'"
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
</template>

<script>
import top from '@/shared/components/top'
import { mapGetters, mapActions } from 'vuex'
import userAPI from '@/app/api/user'
import tabAccount from './tabs/account'
import tabPayment from './tabs/payment'
import tabKeys from './tabs/keys'

export default {
  components: {
    top,
    tabAccount,
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
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    checkRouteTab () {
      let allowed = ['account', 'payment', 'keys']

      if (this.currentTab === undefined || (allowed.indexOf(this.currentTab) > -1) === false) {
        this.$router.push({ name: 'settings', params: { tab: 'account' } })
      }
    },
    processForm (data) {
      this.formLoading = true

      // Remove empty fields from the list
      for (var key in data) {
        if (data[key] === null) {
          delete data[key]
        }
      }

      userAPI.edit({
        data: data,
        success: response => {
          console.log('User updated', data)
          this.dealWithSuccess()
        },
        fail: error => {
          this.dealWithError(error)
        }
      })
    },
    async dealWithSuccess () {
      await this.syncCurrentUser()

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
