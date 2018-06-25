<template>
  <div
    v-if="showDetails"
    class="details">
    <div class="items">
      <div class="price">
        <h6>Price</h6>
        <p>{{ item.quantity }} x {{ item.amount | currency }}</p>
      </div>
      <div class="price">
        <h6>Total Cost</h6>
        <p>{{ item.amount * item.quantity | currency }}</p>
      </div>
      <div
        v-if="item.sync_timestamp"
        class="date">
        <h6>Last Sync</h6>
        <p>{{ item.sync_timestamp | moment('from') }}</p>
      </div>
      <div class="actions">
        <button
          v-if="!item.error"
          :class="{'button-danger': order.status === 'ACTIVE' && item.status === 'ACTIVE'}"
          :disabled="(order.status !== 'ACTIVE' || item.status !== 'ACTIVE') && !(item.status !== 'ACTIVE' && item.error)"
          class="button-sm"
          @click.stop="cancel()">
          <span class="icon-x-circle"/> Cancel Resource
        </button>
        <router-link
          :to="{ name: 'marketView', params: { id: item.resource, type: (item.type === 'NODE_GROUP' || item.type == 'MANAGED') ? 'group' : 'node' } }"
          class="button-sm button-info">
          <span class="icon-book-open"/> View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import cancelItemModal from './cancelItemModal'

export default {
  components: {
    cancelItemModal
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    order: {
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
  methods: {
    toggleDetails () {
      this.$emit('toggleDetails')
    },
    cancel () {
      this.$modal.show(cancelItemModal, {
        id: this.item.id,
        cancelItem: () => {
          this.item.status = 'CANCELLED'
          this.$emit('sortItems')
        }
      }, {
        height: 'auto'
      })
    }
  }
}
</script>
