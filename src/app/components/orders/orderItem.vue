<template>
  <div class="order-item">
    <div @click="toggleDetails()" class="overview items">
      <div class="title">
        <h5 class="mb-1">
          <template v-if="item.type === 'MANAGED'">Managed </template>
          Node
          <template v-if="item.type === 'NODE_GROUP' || item.type === 'MANAGED'"> Group</template>
          #{{ item.resource }}
        </h5>
        <h6 :class="['status-' + item.status]"><div class="status-dot status-active" :class="['status-' + item.status]"></div> {{ item.status }}</h6>
      </div>
      <div :class="['sync-status-' + (item.sync_status === 'PENDING_SYNC' ? 'pending' : 'complete')]">
        <span v-if="item.sync_status === 'PENDING_SYNC'"><span class="icon-rotate-cw"></span> Sync Pending</span>
        <span v-else><span class="icon-check-circle"></span> In Sync</span>
      </div>
      <div class="details-toggle">
        <template v-if="!showDetails"><span class="icon-chevron-down"></span> Show Details</template>
        <template v-else><span class="icon-chevron-up"></span> Hide Details</template>
      </div>
    </div>
    <div v-if="showDetails" class="details">
      <div class="items">
        <div class="price">
          <h6>Price</h6>
          <p>{{ item.quantity }} x {{ item.amount | currency }}</p>
        </div>
        <div class="price">
          <h6>Total Cost</h6>
          <p>{{ item.amount * item.quantity | currency }}</p>
        </div>
        <div class="date">
          <h6>Last Sync</h6>
          <p>{{ item.sync_timestamp | moment('from') }}</p>
        </div>
        <div class="actions">
          <button @click.stop="cancel()" class="button button-sm button-bordered" :class="{'button-danger': item.status === 'ACTIVE'}" :disabled="item.status !== 'ACTIVE'"><span class="icon-x-circle"></span> Cancel Item</button>
          <router-link :to="{ name: 'marketView', params: { id: item.resource, type: (item.type === 'NODE_GROUP' || item.type == 'MANAGED') ? 'group' : 'node' } }" class="button button-sm button-info">
            <span class="icon-eye"></span> Full Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cancelItemModal from './cancelItemModal'

export default {
  props: {
    item: Object
  },
  data () {
    return {
      showDetails: false
    }
  },
  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails
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
  },
  components: {
    cancelItemModal
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  margin-bottom: 12px;
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(33, 41, 56, 0.1);

  .items {
    display: flex;
    align-items: center;

    > div {
      margin-right: 40px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .overview {
    padding: 20px;
    cursor: pointer;

    .title {
      flex: 1;
    }
    h6[class^="status-"] {
      padding-right: 6px;
      font-weight: $font-semi;
    }
    [class^="sync-status-"] {
      margin-right: 20px;
      font-weight: $font-semi;

      [class^="icon-"] {
        font-size: 90%;
        margin-right: 4px;
      }
    }
  }
  .details {
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-top: 0;

    h6 {
      margin-bottom: 4px;
    }
    .actions {
      margin-left: auto;
      display: flex;
      align-items: center;

      .button {
        margin-left: 6px;
      }
    }
    &:before {
      flex: 0 0 100%;
      margin: 20px 0;
      margin-top: 0;
      content: '';
      border-top: 1px dashed $color-border;
    }
  }
  .status-ACTIVE, .sync-status-complete {
    color: $color-success;
    border-color: $color-success;
  }
  .status-PENDING {
    color: $color-warning;
    border-color: $color-warning;
  }
  .status-CANCELLED, .sync-status-pending {
    color: $color-light;
    border-color: $color-light;
  }
  .details-toggle {
    width: 100px;
    text-align: right;
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 2px;
  border-radius: 12px;
  background: transparent;
  border: 3px solid $color-border;
}
</style>
