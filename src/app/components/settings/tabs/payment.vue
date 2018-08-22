<template>
  <div>
    <div class="grid-container">
      <div class="grid-title">
        <h2>Payment Details</h2>
      </div>

      <div class="col-8">
        <billing-form/>
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
import billingForm from '../components/billingForm'
import savedCards from '../components/savedCards'
import credits from '../components/credits'
import promoCodes from '../components/promoCodes'

export default {
  components: {
    billingForm,
    savedCards,
    credits,
    promoCodes
  },
  metaInfo: {
    title: 'Payment Details'
  }
}
</script>
