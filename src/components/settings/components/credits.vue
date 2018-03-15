<template>
  <div class="credit-details">
    <h3>Account credits</h3>
    <div v-if="user.credit && user.credit > 0">
      <p>{{ $i18n.t('payments.COUNT_ACCOUNT_CREDIT', { credit: user.credit }) }}</p>
      <router-link :to="{ name: 'addCredit' }" class="button">
        {{ $i18n.t('payments.ADD_CREDIT') }}
      </router-link>
    </div>
    <div v-else>
      <p>{{ $i18n.t('payments.NO_ACCOUNT_CREDIT')}}</p>
      <router-link :to="{ name: 'addCredit' }" class="button">
        {{ $i18n.t('payments.ADD_CREDIT') }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
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
