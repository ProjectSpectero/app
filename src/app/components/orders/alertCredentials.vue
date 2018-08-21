<template>
  <div class="message mb-3">
    <div>
      <h5>Looking for your access credentials?</h5>
      <p>
        You can find access details for this order on the
        <router-link :to="{ name: 'orderResources', params: { id: order.id } }">
          order resources page.
        </router-link>
      </p>
    </div>
    <div class="actions">
      <router-link
        :to="{ name: 'orderResources', params: { id: order.id } }"
        class="button">
        View Credentials
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}
</script>
