<template>
  <div v-if="user">
    <template v-if="!error">
      <div v-if="order">
        <top
          :subtitle="'Order Number: ' + paddedId"
          title="Order Details">
          <router-link
            v-if="!loading && order.status === 'ACTIVE'"
            :to="{ name: 'orderResources', params: { id: order.id } }"
            class="button-info">
            <span class="icon-package"/> {{ $t('orders.VIEW_RESOURCES') }}
          </router-link>

          <dropdown ref="dropdown">
            <template slot="btn">
              <button class="button">Actions</button>
            </template>
            <template slot="body">
              <router-link :to="{ name: 'invoice', params: { id: invoice.id } }">
                <span class="icon-tag"/> {{ $t('orders.VIEW_LATEST_INVOICE') }}
              </router-link>

              <router-link :to="{ name: 'orderInvoices', params: { id: order.id } }">
                <span class="icon-tag"/> {{ $t('orders.VIEW_ALL_INVOICES') }}
              </router-link>

              <template v-if="order.status !== 'CANCELLED'">
                <router-link
                  v-if="isUnpaid && isPayable"
                  :to="{ name: 'invoice', params: { id: invoice.id } }">
                  <span class="icon-dollar-sign"/> {{ $t('misc.PAY_NOW') }}
                </router-link>
                <router-link
                  v-if="!loading && order.status === 'ACTIVE'"
                  :to="{ name: 'orderResources', params: { id: order.id } }">
                  <span class="icon-package"/> {{ $t('orders.VIEW_RESOURCES') }}
                </router-link>
                <a
                  class="danger"
                  @click.stop="cancel(order.id)">
                  <span class="icon-x-circle"/> {{ $t('misc.CANCEL') }} {{ $t('misc.ORDER') }}
                </a>
              </template>
            </template>
          </dropdown>

          <div
            v-if="!loading"
            slot="sub"
            class="sub">
            <div class="col-info">
              <div class="info-box">
                <h5>{{ $t('misc.ORDER_DATE') }}</h5>
                <p>{{ order.created_at | moment('MMM D, YYYY') }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $t('misc.TERM') }}</h5>
                <p>{{ $t('market.TERM.' + ((order.term === 365) ? 'YEARLY' : 'MONTHLY')) }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $t('misc.STATUS') }}</h5>
                <div :class="'badge-' + order.status.toLowerCase()">
                  {{ $t('orders.ORDER_STATUS.' + order.status) }}
                </div>
              </div>
              <div class="info-box">
                <h5>{{ $t('misc.ORDER') }} {{ $t('misc.TOTAL') }}</h5>
                <p>{{ invoice.amount | currency }}</p>
              </div>
              <div
                v-if="order.due_next"
                class="info-box">
                <h5>{{ $t('misc.NEXT_DUE_DATE') }}</h5>
                <p>{{ order.due_next | moment('MMM D, YYYY') }}</p>
                <router-link :to="{ name: 'invoice', params: { id: invoice.id } }">
                  {{ $t('orders.VIEW_LATEST_INVOICE') }}
                </router-link>
              </div>
            </div>
          </div>
        </top>

        <div v-if="!loading">
          <div class="container">
            <section class="col-12">
              <alert-outstanding
                v-if="isOutstanding && isUnpaid && isPayable"
                :due="due"
                :invoice="invoice"
                :show-invoice-link="true"/>

              <alert-unpayable
                v-else-if="isUnpaid && !isPayable && !isProcessing"
                :invoice="invoice"
                :order="order"/>

              <alert-credentials
                v-if="order.status === 'ACTIVE'"
                :order="order"/>
            </section>

            <section class="col-9">
              <div class="content-section">
                <template v-if="isEnterpriseOrder">
                  <header>
                    <h3><span class="icon-server icon-bg-info"/>Order Items (Enterprise)</h3>
                  </header>
                </template>
                <template v-else>
                  <header>
                    <h3><span class="icon-server icon-bg-info"/>Order Items</h3>
                    <div class="filter-bar">
                      <sort-dropdown
                        :button-text="'Sort Resources'"
                        :sort-fields="sort.fields"
                        @sortUpdate="sortUpdate"/>
                    </div>
                  </header>
                  <alert-processing
                    v-if="isProcessing"
                    :error-bag="verificationErrors"
                    :invoice="invoice"
                    @update="fetchOrder"/>
                </template>

                <order-item
                  v-for="(item, index) in order.line_items"
                  :key="index"
                  :item="item"
                  :order="order"
                  :type="isEnterpriseOrder ? 'ENTERPRISE' : 'REGULAR'"
                  @sortItems="sortItems" />
              </div>
            </section>
            <section class="col-3">
              <div class="content-section latest-invoice">
                <header>
                  <h3><span class="icon-dollar-sign icon-bg-info"/>Latest Invoice</h3>
                </header>
                <div class="invoice-details">
                  <div class="balance">
                    <h6>Balance Due</h6>
                    <span
                      :class="{'text-info': due.amount > 0}"
                      class="balance-left">{{ due.amount | currency }}</span>
                  </div>
                  <div class="details">
                    <small class="text-light">Invoice No: {{ invoice.id }}</small>
                    <small
                      v-if="order.due_next"
                      class="text-light">{{ $t('misc.NEXT_DUE_DATE') }}: {{ order.due_next | moment('MMM D, YYYY') }}</small>
                  </div>
                </div>

                <div class="invoice-links">
                  <router-link
                    :to="{ name: 'invoice', params: { id: invoice.id } }"
                    class="button-info mb-1">View Invoice</router-link>

                  <router-link
                    :to="{ name: 'orderInvoices', params: { id: order.id } }"
                    class="button mb-1">View All Invoices</router-link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'
import invoiceAPI from '@/app/api/invoice'
import orderMixin from '@/app/mixins/order'
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
import alertUnpayable from '../invoices/alertUnpayable'
import alertCredentials from './alertCredentials'
import cancelOrderModal from './cancelOrderModal'

export default {
  components: {
    top,
    error,
    loading,
    Dropdown,
    sortDropdown,
    orderItem,
    alertOutstanding,
    alertUnpayable,
    alertProcessing,
    tooltip,
    cancelOrderModal,
    alertCredentials
  },
  metaInfo: {
    title: 'Order Details'
  },
  mixins: [
    orderMixin
  ],
  data () {
    return {
      order: null,
      invoice: null,
      due: null,
      errorItem: 'order',
      errorCode: 404,
      verified: false,
      verificationErrors: [],
      sort: {
        fields: {
          'resource': 'Resource ID',
          'status': 'Status',
          'type': 'Type',
          'sync_status': 'Sync Status'
        },
        order: 'desc',
        col: 'id'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      isEnterprise: 'appAuth/isEnterprise'
    }),
    paddedId () {
      return this.order.id.toString().padStart(5, '0')
    },
    isOutstanding () {
      return this.verified && this.verificationErrors.length === 0 && this.isUnpaid
    },
    isProcessing () {
      return this.verified && this.verificationErrors.length > 0 && this.isFixable
    }
  },
  async created () {
    await this.fetchOrder()
  },
  methods: {
    async fetchOrder () {
      await orderAPI.order({
        data: { id: this.$route.params.id },
        success: async response => {
          if (response.data.result) {
            this.order = response.data.result
            this.invoice = this.order.last_invoice
            this.invoiceId = this.invoice.id

            for (let key in this.order.line_items) {
              this.order.line_items[key].error = null
            }

            this.sortItems()

            // Fetch due for last invoice (comes with the order object)
            await this.fetchDue()

            // Test if this order is fixable (only certain status need the verify + fix combo)
            // for invalid resources
            if (this.isFixable) {
              await this.verify()
            } else {
              this.verified = true
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
        data: { id: this.invoice.id },
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
    cancel (id) {
      this.$refs.dropdown.isHidden = true
      this.$modal.show(cancelOrderModal, {
        id: id,
        enterpriseOrder: this.isEnterpriseOrder,
        cancelled: () => {
          this.fetchOrder()
        }
      }, {
        height: 'auto'
      })
    },
    async verify () {
      await orderAPI.verify({
        data: { id: this.order.id },
        success: response => {
          this.verified = true
          this.verificationErrors = []
        },
        fail: error => {
          this.verified = true

          if (typeof error.errors === 'object') {
            for (let key in error.errors) {
              let e = error.errors[key]
              this.verificationErrors.push(e)

              let itemIndex = this.order.line_items.findIndex(i => i.id === e.id)
              let item = Object.assign({}, this.order.line_items[itemIndex])

              item.error = e.reason
              this.$set(this.order.line_items, itemIndex, item)
            }
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
  }
}
</script>

<style lang="scss" scoped>
.order-item:last-child {
  margin-bottom: 0;
}

.latest-invoice {
  .invoice-details {
    display: flex;
    align-items: center;

    margin-bottom: $pad;
    padding: $pad 0;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;

    .balance {
      flex: 1;

      h6 {
        margin-bottom: 8px;
      }
      .balance-left {
        font-size: 210%;
        font-weight: $font-bold;
        line-height: 100%;
      }
    }

    .details {
      text-align: right;
    }
    span, small {
      display: block;
    }

    h6 {
      font-weight: $font-semi;
      color: $color-primary;
    }

    small {
      margin-bottom: 12px;
      font-size: 100%;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
