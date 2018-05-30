<template>
  <div>
    <template v-if="!error">
      <div v-if="order">
        <top title="Order Details" :subtitle="'Order Number: ' + order.id.toString().padStart(5, '0')">
          <router-link v-if="!loading && order.status === 'ACTIVE'" class="button button-info" :to="{ name: 'resources', params: { id: order.id } }">
            <span class="icon-package"></span> {{ $i18n.t('orders.VIEW_RESOURCES') }}
          </router-link>

          <dropdown>
            <template slot="btn">
              <button class="button">Actions</button>
            </template>
            <template slot="body">
              <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">
                <span class="icon-tag"></span> {{ $i18n.t('orders.VIEW_LATEST_INVOICE') }}
              </router-link>

              <template v-if="order.status !== 'CANCELLED'">
                <router-link v-if="order.last_invoice && order.last_invoice.status === 'UNPAID'" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
                  <span class="icon-dollar-sign"></span> {{ $i18n.t('misc.PAY_NOW') }}
                </router-link>
                <router-link v-if="!loading && order.status === 'ACTIVE'" :to="{ name: 'resources', params: { id: order.id } }">
                  <span class="icon-package"></span> {{ $i18n.t('orders.VIEW_RESOURCES') }}
                </router-link>
                <a @click.stop="cancel(order.id)" class="danger">
                  <span class="icon-x-circle"></span> {{ $i18n.t('misc.CANCEL') }} {{ $i18n.t('misc.ORDER') }}
                </a>
              </template>
            </template>
          </dropdown>

          <div v-if="!loading" slot="sub" class="sub">
            <div class="col-info">
              <div class="info-box">
                <h5>{{ $i18n.t('misc.ORDER_DATE') }}</h5>
                <p>{{ order.created_at | moment('MMM D, YYYY') }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.TERM') }}</h5>
                <p>{{ $i18n.t('market.TERM.' + ((order.term === 365) ? 'YEARLY' : 'MONTHLY')) }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.STATUS') }}</h5>
                <div :class="'badge status-' + order.status.toLowerCase()">
                  {{ $i18n.t('orders.ORDER_STATUS.' + order.status) }}
                </div>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.ORDER') }} {{ $i18n.t('misc.TOTAL') }}</h5>
                <p>{{ order.last_invoice.amount | currency }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.NEXT_DUE_DATE') }}</h5>
                <p>{{ order.due_next | moment('MMM D, YYYY') }}</p>
                <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">
                  {{ $i18n.t('orders.VIEW_LATEST_INVOICE') }}
                </router-link>
              </div>
            </div>
          </div>
        </top>
        <div v-if="!loading">
          <div class="container">
            <template v-if="verified && !verificationErrors && order.last_invoice.status === 'UNPAID'">
              <alert-outstanding :due="due" :invoice="order.last_invoice"></alert-outstanding>
            </template>
            <template v-else-if="verified && verificationErrors && isFixable()">
              <alert-processing :errorBag="verificationErrors" :invoice="order.last_invoice" @update="fetchOrder"></alert-processing>
            </template>

            <section class="col-12">
              <h3>Items in this order</h3>
              <div class="filter-bar">
                <sort-dropdown :buttonText="'Sort Items By'" :sortFields="sort.fields" @sortUpdate="sortUpdate"></sort-dropdown>
              </div>
              <order-item v-for="(item, index) in order.line_items" :key="index" :item="item" @sortItems="sortItems" />
            </section>
          </div>
        </div>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'
import invoiceAPI from '@/app/api/invoice'
import { mapGetters } from 'vuex'
import Dropdown from 'bp-vuejs-dropdown'
import orderItem from './orderItem'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import tooltip from '@/shared/components/tooltip'
import sortDropdown from '@/shared/components/sortDropdown'
import alertProcessing from '../invoices/alertProcessing'
import alertOutstanding from '../invoices/alertOutstanding'

export default {
  data () {
    return {
      order: null,
      due: null,
      errorItem: 'order',
      errorCode: 404,
      verified: false,
      verificationErrors: null,
      sort: {
        fields: {
          'id': 'ID',
          'status': 'Status',
          'type': 'Type',
          'sync_status': 'Sync Status'
        },
        order: 'desc',
        col: 'id'
      }
    }
  },
  created () {
    this.fetchOrder()
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  methods: {
    async fetchOrder () {
      await orderAPI.order({
        data: {
          id: this.$route.params.id
        },
        success: async response => {
          if (response.data.result) {
            this.order = response.data.result
            this.sortItems()

            // Fetch due for last invoice (comes with the order object)
            await this.fetchDue()

            // Test if this order is fixable (only certain status need the verify + fix combo)
            // for invalid resources
            if (this.isFixable()) {
              await this.verify()
            }

            this.error = false
          } else {
            this.error = true
          }
        },
        fail: e => {
          console.log(e)
          this.error = true
        }
      })
    },
    async fetchDue () {
      await invoiceAPI.due({
        data: { id: this.order.last_invoice_id },
        success: response => {
          if (response.data.result) {
            this.due = response.data.result
            this.error = false
            this.loading = false
          }
        },
        fail: e => {
          console.log(e)
          this.error = true
        }
      })
    },
    async cancel (id) {
      await orderAPI.delete({
        data: {
          id: id
        },
        success: response => {
          this.order.status = 'CANCELLED'
          this.$toasted.success(this.$i18n.t('orders.CANCEL_SUCCESS'))
        },
        fail: e => {
          this.$toasted.error(this.$i18n.t('orders.CANCEL_ERROR'))
        }
      })
    },
    isFixable () {
      const options = ['MANUAL_FRAUD_CHECK', 'AUTOMATED_FRAUD_CHECK', 'PENDING']
      const status = this.order.status

      return options.includes(status)
    },
    async verify () {
      await orderAPI.verify({
        data: { id: this.order.id },
        success: response => {
          this.verified = true
          this.verificationErrors = null
        },
        fail: error => {
          this.verified = true

          if (typeof error.errors === 'object') {
            this.verificationErrors = error.errors
          } else {
            this.$toasted.error(this.errorAPI(error, 'orders'))
          }
        }
      })
    },
    sortUpdate (data) {
      this.sort.col = data.col
      this.sort.order = data.order

      this.sortItems()
    },
    sortItems () {
      return this.order.line_items.sort((a, b) => {
        const parsedA = a[this.sort.col].toString().toUpperCase()
        const parsedB = b[this.sort.col].toString().toUpperCase()
        return (this.sort.order === 'asc') ? (parsedA < parsedB) : (parsedA > parsedB)
      })
    }
  },
  components: {
    top,
    error,
    loading,
    Dropdown,
    sortDropdown,
    orderItem,
    alertOutstanding,
    alertProcessing,
    tooltip
  },
  metaInfo: {
    title: 'Order Details'
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-active {
    @extend .badge-success;
  }
  &.status-automated_fraud_check, &.status-manual_fraud_check {
    @extend .badge-warning;
  }
}
</style>
