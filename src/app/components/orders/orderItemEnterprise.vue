<template>
  <div class="details">
    {{ item }}

    <div
      v-if="accessor"
      class="accessor">
      <div class="credentials">
        <div class="label">
          <label>{{ $i18n.t('orders.ACCESSOR_DETAILS') }}</label>
        </div>

        <p>{{ $i18n.t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
        <p>{{ $i18n.t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>
      </div>
    </div>

  </div>
</template>

<script>
import resourcesMixin from '@/app/mixins/resources'
import resourceDetails from './resourceDetails'

export default {
  components: {
    resourceDetails
  },
  mixins: [
    resourcesMixin
  ],
  props: {
    item: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    showDetails: {
      type: Boolean,
      required: true
    }
  },
  created () {
    this.fetchResources()
  }
}
</script>

<style>

</style>
