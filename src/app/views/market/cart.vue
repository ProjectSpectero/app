<template>
  <div>
    <top :title="$t('misc.CART')">
      <div v-if="cart && cart.length">
        <button
          class="button-dark button-bordered"
          @click.stop="clearCart">
          {{ $t('market.CLEAR_CART') }}
        </button>
      </div>
    </top>
    <div class="container">
      <div class="cart col-12">
        <div class="cart-items">
          <div
            v-if="cart && cart.length"
            class="section">
            <cartItem
              v-for="(item, index) in cart"
              :key="index"
              :item="item"/>
          </div>
          <div
            v-else
            class="cart-empty">
            <div class="alert-msg-centered">
              <div class="icon-shopping-cart big-icon"/>
              <h1>{{ $t('market.CART_EMPTY') }}</h1>
              <p>{{ $t('market.CART_EMPTY_MSG') }}</p>
              <router-link
                :to="{ name: 'market' }"
                class="button-info">
                {{ $t('market.SHOP_NOW') }}
              </router-link>
            </div>
          </div>
        </div>
        <template v-if="cart && cart.length">
          <div class="summary-box-container">
            <div class="summary-box section">
              <section>
                <h3>{{ $t('market.CART_SUMMARY') }}</h3>
                <div class="line-items">
                  <div
                    v-if="totals.type.node > 0"
                    class="item">
                    <p>{{ $t('misc.NODES') }}</p>
                    <div class="amount">{{ totals.type.node | currency }}</div>
                  </div>
                  <div
                    v-if="totals.type.group > 0"
                    class="item">
                    <p>{{ $t('misc.NODE_GROUPS') }}</p>
                    <div class="amount">{{ totals.type.group | currency }}</div>
                  </div>

                  <div class="separator"/>

                  <div class="item total">
                    <p>{{ $t('market.DUE_TODAY') }}</p>
                    <div class="amount">{{ totals.total | currency }} USD</div>
                  </div>
                </div>
                <button
                  class="button-success button-md max-width"
                  @click.stop="checkout">
                  {{ $t('misc.CHECKOUT') }}
                </button>
              </section>
            </div>
            <div
              v-if="totals.cycle.monthly > 0 || totals.cycle.yearly > 0"
              class="summary-box section">
              <section class="recurring">
                <h3>{{ $t('market.RECURRING_FEES') }}</h3>
                <p>{{ $t('market.RECURRING_FEES_TEXT') }}</p>
                <div class="line-items">
                  <div
                    v-if="totals.cycle.monthly > 0"
                    class="item">
                    <p>{{ $t('market.TERM.MONTHLY') }}</p>
                    <div class="amount">{{ totals.cycle.monthly | currency }} /month</div>
                  </div>
                  <div
                    v-if="totals.cycle.yearly > 0"
                    class="item">
                    <p>{{ $t('market.TERM.YEARLY') }}</p>
                    <div class="amount">{{ totals.cycle.yearly | currency }} /year</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import top from '@/shared/components/top'
import marketAPI from '@/app/api/market'
import cartItem from '@/app/components/market/cartItem'

export default {
  components: {
    top,
    cartItem
  },
  metaInfo: {
    title: 'Cart'
  },
  computed: {
    ...mapGetters({
      cart: 'cart/cart',
      totals: 'cart/totals'
    })
  },
  async created () {
    await this.fetchPlans()
    await this.refreshCart()
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
          this.$router.push({ name: 'checkout', params: { id: response.data.result.last_invoice_id } })
          this.$toasted.success(this.$t('market.ORDER_PROCESSED', { invoice: response.data.result.last_invoice_id }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'market'))
      })
    }
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
    border-bottom: none;
  }
}
.summary-box-container {
  width: 340px;
  margin-left: $pad;
}
.summary-box {
  padding: $pad;

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
