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
          <tab-account v-if="currentTab === 'account'"/>
          <tab-payment v-else-if="currentTab === 'payment'"/>
          <tab-keys v-else-if="currentTab === 'keys'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import tabAccount from '@/app/components/settings/tabs/account'
import tabPayment from '@/app/components/settings/tabs/payment'
import tabKeys from '@/app/components/settings/tabs/keys'

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
  computed: {
    currentTab: function () {
      return this.$route.params.tab
    }
  },
  watch: {
    '$route': 'checkRouteTab'
  },
  created () {
    this.checkRouteTab()
  },
  methods: {
    checkRouteTab () {
      let allowed = ['account', 'payment', 'keys']

      if (this.currentTab === undefined || (allowed.indexOf(this.currentTab) > -1) === false) {
        this.$router.push({ name: 'settings', params: { tab: 'account' } })
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
