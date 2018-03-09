<template>
  <div>
    <h3>Account credits</h3>

    <div v-if="user.credit && user.credit > 0">
      <p>
        {{ $i18n.t('payments.COUNT_ACCOUNT_CREDIT') }}
        <router-link :to="{ name: 'addCredits' }">
          {{ $i18n.t('payments.ADD_MORE_CREDIT') }}
        </router-link>
      </p>
    </div>
    <div v-else>
      <p>
        {{ $i18n.t('payments.NO_ACCOUNT_CREDIT')}}
        <router-link :to="{ name: 'addCredit' }">
          {{ $i18n.t('payments.ADD_CREDIT') }}
        </router-link>
      </p>
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
