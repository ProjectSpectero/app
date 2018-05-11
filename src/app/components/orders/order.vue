<template>
  <div>
    <template v-if="!error">
      <div v-if="order">
        <top title="Order Details">
          <router-link class="button" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
            {{ $i18n.t('orders.VIEW_INVOICE') }}
          </router-link>

          <template v-if="order.status !== 'CANCELLED'">
            <button @click.stop="cancel(order.id)" class="button">
              {{ $i18n.t('misc.CANCEL') }}
            </button>

            <div class="inline" v-if="order.last_invoice && order.last_invoice.status === 'UNPAID'">
              <router-link class="button button-success" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
                {{ $i18n.t('misc.PAY_NOW') }}
              </router-link>
            </div>
          </template>
        </top>
        <div v-if="!loading" class="order">
          <div class="container">
            <div class="col-info">
              <div class="info-box">
                <h5>{{ $i18n.t('orders.REFERENCE_NUM') }}</h5>
                <p>{{ order.id }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.STATUS') }}</h5>
                <div :class="'badge status-' + order.status.toLowerCase()">
                  {{ $i18n.t('orders.ORDER_STATUS.' + order.status) }}
                </div>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.TOTAL') }}</h5>
                <p>{{ order.last_invoice.amount | currency }} {{ order.last_invoice.currency }}</p>
              </div>
              <div class="info-box">
                <h5>{{ $i18n.t('misc.NEXT_DUE_DATE') }}</h5>
                <p>{{ order.due_next | moment('MMM D, YYYY') }}</p>
                <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">
                  {{ $i18n.t('orders.VIEW_LATEST_INVOICE') }}
                </router-link>
              </div>
              <div v-if="order.status === 'ACTIVE'" class="info-box">
                <h5>{{ $i18n.t('misc.RESOURCES') }}</h5>
                <router-link class="button" :to="{ name: 'resources', params: { id: order.id } }">
                  {{ $i18n.t('orders.VIEW_ALL_RESOURCES') }}
                </router-link>
              </div>
            </div>
          </div>

          <items :items="order.line_items"></items>
        </div>
      </div>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'
import { mapGetters } from 'vuex'
import items from './items'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'

export default {
  data () {
    return {
      order: null,
      errorItem: 'order',
      errorCode: 404
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
        success: response => {
          if (response.data.result) {
            this.order = response.data.result
            this.loading = false
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
    }
  },
  components: {
    top,
    error,
    items
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
