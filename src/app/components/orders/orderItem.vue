<template>
  <div class="order-item">
    <div @click="toggleDetails()" class="overview items">
      <div class="title">
        <h5 class="mb-0">
          <div
            v-tooltip="$i18n.t('orders.ORDER_STATUS.' + ((item.error) ? 'ERROR' : item.status))"
            class="status-dot status-active"
            :class="['status-' + status, {'status-error': item.error }]">
          </div>
          Resource {{ item.resource }}
        </h5>
        <span v-if="item.error" class="line-msg text-danger">
          <span class="icon-alert-circle"></span>
          {{ $i18n.t(`invoices.RESOURCE_ERROR.${item.error}`) }}
        </span>
      </div>

      <div>
        <span class="badge">
          <template v-if="item.type === 'MANAGED'">Managed </template>
          Node
          <template v-if="item.type === 'NODE_GROUP' || item.type === 'MANAGED'"> Group</template>
        </span>
      </div>
      <div
        :class="['sync-status-' + (item.sync_status === 'PENDING_SYNC' ? 'pending' : 'complete')]"
        v-tooltip="(item.sync_status === 'PENDING_SYNC') ? 'Sync Pending' : 'In Sync'">
        <span class="icon-refresh-cw icon-big"></span>
      </div>
      <div class="details-toggle">
        <span v-if="!showDetails" class="icon-chevron-down"></span>
        <span v-else class="icon-chevron-up"></span>
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
        <div v-if="item.sync_timestamp" class="date">
          <h6>Last Sync</h6>
          <p>{{ item.sync_timestamp | moment('from') }}</p>
        </div>
        <div class="actions">
          <button
            v-if="!item.error"
            @click.stop="cancel()"
            class="button-sm"
            :class="{'button-danger': item.status === 'ACTIVE'}"
            :disabled="item.status !== 'ACTIVE' && !(item.status !== 'ACTIVE' && item.error)">
            <span class="icon-x-circle"></span> Cancel Resource
          </button>
          <router-link :to="{ name: 'marketView', params: { id: item.resource, type: (item.type === 'NODE_GROUP' || item.type == 'MANAGED') ? 'group' : 'node' } }" class="button-sm button-info">
            <span class="icon-book-open"></span> View Details
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
  computed: {
    status () {
      return this.item.status.toLowerCase()
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
@import '~@styles/components/icons';

.order-item {
  margin-bottom: 12px;
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(33, 41, 56, 0.05);
  border: 1px solid $color-border;
  border-radius: 6px;

  .items {
    display: flex;
    align-items: center;

    > div {
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .overview {
    padding: 16px;
    cursor: pointer;

    .title {
      flex: 1;
    }
    [class^="sync-status-"] {
      font-weight: $font-semi;

    }
    [class^="icon-"].icon-big {
      font-size: 16px;
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

  .sync-status-complete {
    color: $color-info;
  }
  .sync-status-pending {
    color: $color-light;
  }

  .details-toggle {
    color: $color-light;
    font-size: 22px;
  }
  .line-msg {
    display: block;
    margin-top: 8px;
    font-weight: $font-bold;

    &.no-space {
      margin-top: 0;
    }
    [class^="icon-"] {
      position: relative;
      top: 1px;
    }

    &.line-cancelled-msg {
      color: $color-light;
      font-weight: $font-semi;
    }
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 4px;
  border-radius: 100%;
  background-color: $color-light;
  border-radius: 3px;

  &.status-active {
    background-color: $color-success;
  }
  &.status-pending {
    background-color: $color-warning;
  }
  &.status-cancelled {
    background-color: $color-light;
  }
  &.status-error {
    background-color: $color-danger;
  }
}
</style>
