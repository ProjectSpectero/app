<template>
  <div class="order-item">
    <div
      class="overview items"
      @click="toggleDetails()">
      <div class="title">
        <h5 class="mb-0">
          <div
            v-tooltip="$t('orders.ORDER_STATUS.' + ((item.error) ? 'ERROR' : item.status))"
            :class="['status-' + status, {'status-error': item.error }]"
            class="status-dot status-active"/>
          {{ item.description }}
        </h5>
        <span
          v-if="item.error"
          class="line-msg text-danger">
          <span class="icon-alert-circle"/>
          {{ $t(`invoices.RESOURCE_ERROR.${item.error}`) }}
        </span>
      </div>

      <div v-if="type !== 'ENTERPRISE'">
        <span class="badge">
          <template v-if="item.type === 'MANAGED'">Managed </template>
          Node
          <template v-if="item.type === 'NODE_GROUP' || item.type === 'MANAGED'"> Group</template>
        </span>
      </div>
      <div
        v-tooltip="(item.sync_status === 'PENDING_SYNC') ? 'Sync Pending' : 'In Sync'"
        :class="['sync-status-' + (item.sync_status === 'PENDING_SYNC' ? 'pending' : 'complete')]">
        <span class="icon-refresh-cw icon-big"/>
      </div>
      <div class="details-toggle">
        <span
          v-if="!showDetails"
          class="icon-chevron-down"/>
        <span
          v-else
          class="icon-chevron-up"/>
      </div>
    </div>

    <order-item-enterprise
      v-if="type === 'ENTERPRISE'"
      :item="item"
      :order="order"
      :show-details="showDetails"
      :status="status"
      @toggleDetails="toggleDetails"/>

    <order-item-regular
      v-else
      :item="item"
      :order="order"
      :show-details="showDetails"
      :status="status"
      @toggleDetails="toggleDetails"
      @sortItems="sortItems"/>
  </div>
</template>

<script>
import orderItemEnterprise from './orderItemEnterprise'
import orderItemRegular from './orderItemRegular'

export default {
  components: {
    orderItemEnterprise,
    orderItemRegular
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: false,
      default: () => {}
    },
    type: {
      validator: (value) => {
        return ['ENTERPRISE', 'REGULAR'].indexOf(value) !== -1
      },
      type: String,
      required: true
    }
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
    sortItems () {
      this.$emit('sortItems')
    }
  }
}
</script>

<style lang="scss">
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
  .accessor {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed $color-border;
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
