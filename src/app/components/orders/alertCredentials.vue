<template>
  <div class="message mb-3">
    <div>
      <h5>Looking for your access credentials?</h5>
      <p>
        You can find all the access details for this order in the
        <router-link :to="{ name: 'orderResources', params: { id: order.id } }">
          resources page
        </router-link>.
      </p>
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
