<template>
  <div>
    <div class="grid-container">
      <div class="grid-title">
        <h2>Payment Details</h2>
      </div>

      <div class="col-8">
        <billing/>
      </div>

      <div class="col-4">
        <h3>Payment Methods</h3>
        <saved-cards/>
        <credits/>
        <promo-codes/>
      </div>
    </div>
  </div>
</template>

<script>
import billing from '@/app/components/users/settings/billing'
import savedCards from '@/app/components/users/settings/savedCards'
import credits from '@/app/components/users/settings/credits'
import promoCodes from '@/app/components/users/settings/promoCodes'

export default {
  components: {
    billing,
    savedCards,
    credits,
    promoCodes
  },
  metaInfo: {
    title: 'Payment Details'
  }
}
</script>
