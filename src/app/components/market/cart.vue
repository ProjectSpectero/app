<template>
  <div>
    <top :title="$i18n.t('misc.CART')">
      <div v-if="cart && cart.length">
        <button class="button button-dark button-bordered" @click.stop="clearCart">
          {{ $i18n.t('market.CLEAR_CART') }}
        </button>
      </div>
    </top>
    <div class="cart">
      <div class="cart-items">
        <div v-if="cart && cart.length" class="container-bordered">
          <cartItem v-for="(item, index) in cart" :key="index" :item="item"></cartItem>
        </div>
        <div v-else class="cart-empty">
          <p>{{ $i18n.t('market.CART_EMPTY') }}</p>
        </div>
      </div>
      <template v-if="cart && cart.length">
        <div class="summary-box-container">
          <div class="summary-box container-bordered">
            <section>
              <h3>Cart Summary</h3>
              <div class="line-items">
                <div class="item" v-if="totals.type.node > 0">
                  <p>Nodes</p>
                  <div class="amount">{{ totals.type.node | currency }}</div>
                </div>
                <div class="item" v-if="totals.type.group > 0">
                  <p>Node Groups</p>
                  <div class="amount">{{ totals.type.group | currency }}</div>
                </div>

                <div class="separator"></div>

                <div class="item total">
                  <p>Due Today</p>
                  <div class="amount">{{ totals.total | currency }} USD</div>
                </div>
              </div>
              <button class="button button-success button-md max-width" @click.stop="checkout">
                {{ $i18n.t('misc.CHECKOUT') }}
              </button>
            </section>
          </div>
          <div v-if="totals.cycle.monthly > 0 || totals.cycle.yearly > 0" class="summary-box container-bordered">
            <section class="recurring">
              <h3>Recurring Fees</h3>
              <p>There are recurring fees associated with items in this cart.</p>
              <div class="line-items">
                <div class="item" v-if="totals.cycle.monthly > 0">
                  <p>Monthly</p>
                  <div class="amount">{{ totals.cycle.monthly | currency }} /month</div>
                </div>
                <div class="item" v-if="totals.cycle.yearly > 0">
                  <p>Yearly</p>
                  <div class="amount">{{ totals.cycle.yearly | currency }} /year</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import top from '@/shared/components/top'
import marketAPI from '@/app/api/market'
import cartItem from './cartItem'

export default {
  async created () {
    await this.fetchPlans()
    await this.refreshCart()
  },
  computed: {
    ...mapGetters({
      cart: 'cart/cart',
      totals: 'cart/totals'
    })
  },
  methods: {
    ...mapActions({
      fetchPlans: 'market/fetchPlans',
      refreshCart: 'cart/refresh',
      clearCart: 'cart/clear'
    }),
    checkout () {
      let cart = []
      let term = null

      this.cart.forEach((item) => {
        cart.push({
          id: item.id,
          type: item.type
        })
        term = item.term === 'YEARLY' ? 365 : 30
      })

      marketAPI.order({
        data: {
          items: cart,
          meta: {
            'term': term
          }
        },
        success: response => {
          this.clearCart()
          this.$router.push({ name: 'invoice', params: { id: response.data.result.last_invoice_id } })
          this.$toasted.success(this.$i18n.t('market.ORDER_PROCESSED', { invoice: response.data.result.last_invoice_id }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'market'))
      })
    }
  },
  metaInfo: {
    title: 'Cart'
  },
  components: {
    top,
    cartItem
  }
}
</script>

<style lang="scss" scoped>
.cart {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.cart-items {
  flex: 1;

  .item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  .container-bordered {
    padding: 16px 0;
  }
}
.container-bordered {
  width: 100%;
  margin-bottom: $pad;
  padding: $pad;
  border-radius: 4px;
  border: 1px solid $color-border;

  &:last-child {
    margin-bottom: 0;
  }
}
.summary-box-container {
  width: 320px;
  margin-left: $pad;
}
.summary-box {
  .separator {
    width: 100%;
    height: 1px;
    display: block;
    margin: 16px 0;
    background-color: $color-border;
    content: '';
  }
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    h3 {
      margin-bottom: $pad;
    }
  }
  .line-items {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      &.total {
        margin-bottom: 20px;
        font-size: 120%;
        font-weight: $font-bold;
      }
    }
  }
  .recurring {
    h3 {
      margin-bottom: 14px;
    }
    > p {
      margin-bottom: 14px;
      font-size: 95%;
      color: $color-light;
    }
  }
}
</style>
