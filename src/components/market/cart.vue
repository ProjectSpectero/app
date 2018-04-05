<template>
  <div>
    <top :title="$i18n.t('misc.CART')">
      <div v-if="cart && cart.length">
        <button class="button" @click.stop="clearCart">
          {{ $i18n.t('market.CLEAR_CART') }}
        </button>
      </div>
    </top>

    <div class="cart">
      <div class="cart-items">
        <div v-if="cart && cart.length">
          <ul>
            <li v-for="(item, index) in cart" :key="index">
              <div class="info">
                <h4>{{ item.friendly_name }}</h4>
                <div class="extras">
                  <ol>
                    <li class="bold">
                      {{ item.price | currency }} USD
                    </li>
                    <li>
                      Type: <span v-if="item.type === 'NODE_GROUP'">Node Group</span><span v-else>Node</span>
                    </li>
                    <li>
                      Model: {{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}
                    </li>
                  </ol>
                </div>
              </div>
              <div class="actions">
                <router-link class="button button-dark button-sm" :to="{ name: 'marketView', params: { type: parseType(item.type), id: item.id } }">
                  {{ $i18n.t('misc.VIEW') }}
                </router-link>
                <button class="button button-danger button-icon" @click.stop="remove(item)">
                  <span class="icon-trash-2"></span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>{{ $i18n.t('market.CART_EMPTY') }}</p>
        </div>
      </div>

      <div v-if="cart && cart.length">
        <div class="summary-box">
          <section>
            <h3>Cart Summary</h3>
            <div class="line-items">
              <div class="item" v-if="totals.nodes > 0">
                <p>Nodes</p>
                <div class="amount">{{ totals.nodes | currency }} USD</div>
              </div>
              <div class="item" v-if="totals.nodeGroups > 0">
                <p>Node Groups</p>
                <div class="amount">{{ totals.nodeGroups | currency }} USD</div>
              </div>
              <div class="item total">
                <p>Subtotal</p>
                <div class="amount">{{ totals.total | currency }} USD</div>
              </div>
            </div>
          </section>
          <div class="checkout-button">
            <button class="button button-info button-md max-width" @click.stop="pay">
              {{ $i18n.t('misc.CHECKOUT') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import marketAPI from '@/api/market.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    this.refreshCart()
  },
  computed: {
    ...mapGetters({
      cart: 'market/cart',
      totals: 'market/totals'
    })
  },
  methods: {
    ...mapActions({
      refreshCart: 'market/refreshCart',
      removeFromCart: 'market/removeFromCart',
      clearCart: 'market/clearCart'
    }),
    parseType (type) {
      if (type.toLowerCase() === 'node') {
        return 'node'
      }

      return 'group'
    },
    pay () {
      marketAPI.order({
        data: {
          items: this.cart,
          meta: {
            'term': 30
          }
        },
        success: response => {
          this.clearCart()
          this.$router.push({ name: 'invoice', params: { id: response.data.result.last_invoice_id } })
          this.$toasted.success(this.$i18n.t('market.ORDER_PROCESSED', { invoice: response.data.result.last_invoice_id }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'market'))
      })
    },
    remove (item) {
      this.removeFromCart(item)
      this.$toasted.success(this.$i18n.t('market.REMOVED_FROM_CART', { name: item.friendly_name }))
    }
  },
  metaInfo: {
    title: 'Cart'
  },
  components: {
    top
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

  ul {
    list-style: none;

    > li {
      display: flex;
      align-items: center;
      margin-bottom: $pad;
      padding-bottom: $pad;
      border-bottom: 1px solid $color-border;
    }
  }
  .info {
    flex: 1;

    h4 {
      font-size: 110%;
      font-weight: $font-semi;
      margin-bottom: 0;
    }
  }
  .extras {
    margin-top: 10px;

    ol {
      list-style: none;

      > li {
        display: inline-block;
        margin-right: 8px;
        padding-right: 10px;
        font-size: 90%;
        color: $color-light;
        border-right: 1px solid $color-border;

        &.bold {
          color: $color-primary;
        }
        &:last-child {
          margin-right: 0;
          padding-right: 0;
          border-right: none;
        }
      }
    }
  }
}
.summary-box {
  width: 300px;
  margin-left: $pad;
  padding: $pad;
  background-color: $color-smoke;
  border-radius: 4px;

  .separate {
    margin-top: $pad;
    padding-top: $pad;
    border-top: 1px solid $color-border;
  }
  section {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    h3 {
      margin-bottom: 0;
    }
  }
  .line-items {
    @extend .separate;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.total {
        @extend .separate;
        font-size: 120%;
        font-weight: $font-bold;
      }
    }
  }
  .checkout-button {
    @extend .separate;
  }
}
</style>
