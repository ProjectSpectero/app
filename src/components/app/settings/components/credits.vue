<template>
  <div class="credit-details">
    <h3>Account credit</h3>
    <p v-if="user.credit && user.credit > 0" v-html="$i18n.t('payments.COUNT_ACCOUNT_CREDIT', { credit: user.credit })"></p>
    <p v-else>{{ $i18n.t('payments.NO_ACCOUNT_CREDIT')}}</p>
    <router-link :to="{ name: 'addCredit' }" class="button">
      {{ $i18n.t('payments.ADD_CREDIT') }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  metaInfo: {
    title: 'Add Credit'
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
    font-weight: $font-semi;
  }
  .button {
    margin-top: 12px;
  }
}
</style>
