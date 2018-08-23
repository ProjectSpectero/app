<template>
  <div
    v-if="user"
    class="credit-details">
    <h3>Account credit</h3>
    <p
      v-if="user.credit && user.credit > 0"
      v-html="$t('payments.COUNT_ACCOUNT_CREDIT', { credit: $filters.currency(user.credit) })"/>
    <p v-else>{{ $t('payments.NO_ACCOUNT_CREDIT') }}</p>
    <router-link
      :to="{ name: 'addCredit' }"
      class="button">
      {{ $t('payments.ADD_CREDIT') }}
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  }
}
</script>

<style lang="scss" scoped>
.credit-details {
  margin-bottom: $pad;
  padding: 14px;
  border: 1px solid $color-border;
  border-radius: 4px;

  h3 {
    margin-bottom: 12px;
  }
  .button {
    margin-top: 12px;
  }
}
</style>
