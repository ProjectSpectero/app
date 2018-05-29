<template>
  <div>
    <top :title="$i18n.t('misc.CART')">
      <div v-if="cart && cart.length">
        <button class="button button-dark button-bordered" @click.stop="clearCart">
          {{ $i18n.t('market.CLEAR_CART') }}
        </button>
      </div>
    </top>
    <div class="cart container">
      <div class="cart-items">
        <div v-if="cart && cart.length" class="section">
          <cartItem v-for="(item, index) in cart" :key="index" :item="item"></cartItem>
        </div>
        <div v-else class="cart-empty">
          <div class="alert-msg-centered">
            <div class="icon-shopping-cart big-icon"></div>
            <h1>{{ $i18n.t('market.CART_EMPTY') }}</h1>
            <p class="spaced">{{ $i18n.t('market.CART_EMPTY_MSG') }}</p>
            <p><router-link :to="{ name: 'market' }" class="button button-info">{{ $i18n.t('market.SHOP_NOW') }}</router-link></p>
          </div>
        </div>
      </div>
      <template v-if="cart && cart.length">
        <div class="summary-box-container">
          <div class="summary-box section">
            <section>
              <h3>{{ $i18n.t('market.CART_SUMMARY') }}</h3>
              <div class="line-items">
                <div class="item" v-if="totals.type.node > 0">
                  <p>{{ $i18n.t('misc.NODES') }}</p>
                  <div class="amount">{{ totals.type.node | currency }}</div>
                </div>
                <div class="item" v-if="totals.type.group > 0">
                  <p>{{ $i18n.t('misc.NODE_GROUPS') }}</p>
                  <div class="amount">{{ totals.type.group | currency }}</div>
                </div>

                <div class="separator"></div>

                <div class="item total">
                  <p>{{ $i18n.t('market.DUE_TODAY') }}</p>
                  <div class="amount">{{ totals.total | currency }} USD</div>
                </div>
              </div>
              <button class="button button-success button-md max-width" @click.stop="checkout">
                {{ $i18n.t('misc.CHECKOUT') }}
              </button>
            </section>
          </div>
          <div v-if="totals.cycle.monthly > 0 || totals.cycle.yearly > 0" class="summary-box section">
            <section class="recurring">
              <h3>{{ $i18n.t('market.RECURRING_FEES') }}</h3>
              <p>{{ $i18n.t('market.RECURRING_FEES_TEXT') }}</p>
              <div class="line-items">
                <div class="item" v-if="totals.cycle.monthly > 0">
                  <p>{{ $i18n.t('market.TERM.MONTHLY') }}</p>
                  <div class="amount">{{ totals.cycle.monthly | currency }} /month</div>
                </div>
                <div class="item" v-if="totals.cycle.yearly > 0">
                  <p>{{ $i18n.t('market.TERM.YEARLY') }}</p>
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
