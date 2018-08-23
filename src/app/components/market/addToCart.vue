<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $t('misc.PURCHASE') }} {{ (item.type.toLowerCase() === 'node') ? $t('misc.NODE') : $t('misc.NODE_GROUP') }}</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <h3>{{ item.friendly_name }}</h3>

      <div
        v-if="item.plan"
        class="message message-success">
        <p v-html="$t(`market.PLAN_PURCHASE_MSG`, { planName: 'Spectero Pro', planUrl: 'https://spectero.com/pro' })"/>
      </div>

      <div
        v-if="item.type === 'NODE_GROUP'"
        class="message message-info message-group-warning"
        v-html="$t(`market.ITEM_IS_GROUP_WARNING`, { count: item.nodes.length })"/>

      <ul class="details">
        <li v-if="item.type === 'NODE_GROUP'">
          {{ $t('misc.TOTAL_NODES') }}: <strong>{{ item.nodes.length }} {{ $t('misc.NODES') }}</strong>
        </li>
        <li v-if="item.asn">{{ $t('misc.ASN') }}: <strong>{{ item.asn }}</strong></li>
        <li v-if="item.city">{{ $t('misc.CITY') }}: <strong>{{ item.city }}</strong></li>
        <li v-if="item.cc">{{ $t('misc.CC') }}: <strong>{{ item.cc }}</strong></li>
        <li>{{ $t('misc.MARKET_MODEL') }}: <strong>{{ $t(`market.MODEL_NODE.${item.market_model}`) }}</strong></li>
      </ul>

      <div class="actions">
        <router-link
          :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }"
          class="button-info"
          @click.native="$emit('close')">
          {{ $t('misc.VIEW_FULL_DETAILS') }}
        </router-link>
      </div>

      <div class="cart">
        <div v-if="!inCart && (cartLocked || (item.plan && cartItemCount !== 0))">
          <div class="message no-icon">
            <span class="icon-alert-circle"/>
            <div>
              <h5>{{ $t('market.CANT_ADD_TO_CART_TITLE') }}</h5>
              <p>{{ $t( (cartLocked) ? 'market.CANT_ADD_TO_CART_MSG_LOCKED' : 'market.CANT_ADD_TO_CART_MSG' ) }}</p>
              <p>{{ $t('market.CHECKOUT_CURRENT_CART') }}</p>
              <p class="actions">
                <router-link
                  :to="{ name: 'cart' }"
                  class="button"
                  @click.native="$emit('close')">
                  {{ $t('market.CHECKOUT_EXISTING_ITEMS') }}
                </router-link>
                <button
                  class="button right"
                  @click.stop="clearCart">
                  {{ $t('market.EMPTY_CART') }}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div
          v-else-if="!inCart || showChangeTerm"
          class="addToCart">
          <h5 v-html="showChangeTerm ? $t('market.CHANGE_TERM') : $t('market.PURCHASE_ACCESS')" />
          <div>
            <div class="terms">
              <div
                :class="{ active: term === 'MONTHLY' }"
                @click="toggleTerm('MONTHLY')">
                <label>{{ $t('market.TERM.MONTHLY') }}</label>
                <span class="price">{{ item.price | currency }} {{ $t('market.PER_MONTH') }}</span>
              </div>
              <div
                :class="{ active: term === 'YEARLY', unavailable: !item.plan }"
                @click="item.plan ? toggleTerm('YEARLY') : false">
                <label>{{ $t('market.TERM.YEARLY') }}</label>
                <span class="price">
                  <template v-if="item.plan">
                    {{ yearlyPrice | currency }} {{ $t('market.PER_YEAR') }}
                  </template>
                  <template v-else>
                    {{ $t('market.UNAVAILABLE') }}
                  </template>
                </span>
                <div
                  v-if="plan && plan['yearly_discount_pct']"
                  class="savings">
                  {{ $t('misc.SAVE') }} {{ plan['yearly_discount_pct'] * 100 }}%
                </div>
              </div>
            </div>
            <div>
              <button
                class="button-success"
                @click.stop="showChangeTerm ? modifyTerm() : add()">
                <span class="icon-shopping-cart"/> {{ showChangeTerm ? $t('market.CHANGE_TERM') : $t('misc.ADD_TO_CART') }}
              </button>
            </div>
          </div>
        </div>

        <template v-else>
          <div class="addedToCart">
            <h5 class="mb-3">
              <span class="icon-shopping-cart"/> {{ $t('market.ADDED_TO_YOUR_CART') }}
            </h5>
            <div>
              <div class="details">
                <ul>
                  <li>
                    {{ $t('misc.PRICE') }}: <strong>{{ (term === 'YEARLY') ? yearlyPrice : item.price | currency }}</strong><br>
                    <span
                      class="link remove"
                      @click="remove">
                      {{ $t('market.REMOVE_FROM_CART') }}
                    </span>
                  </li>
                  <li>
                    {{ $t('misc.TERM') }}: <strong>{{ $t(`market.TERM.${term}`) }}</strong><br>
                    <span
                      class="link"
                      @click="showTerms">
                      {{ $t('market.CHANGE_TERM') }}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <button
                  class="button"
                  @click="$emit('close')">
                  {{ $t('misc.CONTINUE_SHOPPING') }}
                </button>
                <router-link
                  :to="{ name: 'cart' }"
                  class="button-success"
                  @click.native="$emit('close')">
                  <span class="icon-check-circle"/> {{ $t('misc.CHECKOUT') }}
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      term: 'MONTHLY',
      showChangeTerm: false
    }
  },
  computed: {
    ...mapGetters({
      cartItemCount: 'cart/itemCount',
      cartLocked: 'cart/locked'
    }),
    inCart () {
      return this.$store.getters['cart/getItem'](this.item.id, this.item.type)
    },
    plan () {
      return this.item.plan ? this.$store.getters['market/plan'](this.item.plan) : null
    },
    yearlyPrice () {
      let price = (this.item.price / 30) * 365
      if (this.plan && this.plan['yearly_discount_pct']) {
        price -= price * this.plan['yearly_discount_pct']
      }
      return Math.floor(price) // floor the price for marketing purposes
    }
  },
  created () {
    if (this.inCart) {
      this.term = this.inCart.term
    }
  },
  methods: {
    ...mapActions({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove',
      changeTerm: 'cart/changeTerm',
      refreshCart: 'cart/refresh',
      clearCart: 'cart/clear'
    }),
    async add () {
      this.showChangeTerm = false

      try {
        await this.addToCart({
          id: this.item.id,
          type: this.item.type,
          term: this.term,
          plan: this.plan ? this.plan.id : null
        })
        this.$toasted.success(this.$t('market.ADDED_TO_CART', { name: this.item.friendly_name }))
      } catch (e) {
        this.$toasted.error(this.$t(`market.${e.message}`, { name: this.item.friendly_name }))
      }
    },
    remove () {
      this.removeFromCart(this.item)
      this.$toasted.show(this.$t('market.REMOVED_FROM_CART', { name: this.item.friendly_name }))
    },
    toggleTerm (term) {
      this.term = term
    },
    showTerms () {
      this.showChangeTerm = true
    },
    modifyTerm () {
      this.showChangeTerm = false

      this.changeTerm({
        id: this.item.id,
        type: this.item.type,
        term: this.term
      })
      this.$toasted.info(this.$t('market.TERM_MODIFIED'))
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  margin-top: $pad;
}
.details {
  list-style: none;

  li {
    line-height: 150%;
  }
}
.message-group-warning {
  margin-bottom: $pad;
}
.cart {
  margin-top: $pad;
  padding-top: $pad;
  border-top: 1px solid $color-border;

  h5 {
    font-size: 120%;
    line-height: 100%;

    [class^="icon-"] {
      margin-right: 4px;
    }
  }
  > div > div {
    display: flex;
    align-items: center;

    > div:first-child {
      flex: 1;
    }
  }

  .terms > div {
    min-width: 150px;
    float: left;
    position: relative;
    margin-right: 12px;
    padding: 10px;
    border: 1px solid $color-border;
    cursor: pointer;

    label {
      display: block;
      margin-bottom: 6px;
      font-size: 110%;
      font-weight: $font-semi;
      cursor: pointer;
    }
    .price {
      opacity: 0.6;
      font-size: 90%;
    }
    .savings {
      padding: 2px 5px 1px 5px;
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 80%;
      text-transform: uppercase;
      color: $white;
      font-weight: $font-semi;
      background: $color-info;
      border-radius: 2px;
    }
    &.active {
      color: $color-info;
      border-color: $color-info;

      label {
        color: $color-info;
      }
      .price {
        opacity: 1;
      }
    }
    &.unavailable {
      opacity: 0.6;
      cursor: not-allowed;

      label {
        cursor: not-allowed;
      }
    }
    &:last-child {
      margin-right: 0;
    }
  }

  .addedToCart {
    h5 {
      color: $color-success;
    }
    .link {
      color: $color-light;

      &:hover {
        color: $color-primary;
      }
    }
    .details {
      ul {
        list-style: none;
      }
      li {
        float: left;
        margin-right: $pad;
        line-height: 140%;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  [class^="button-"] {
    // This "fixes" a bug where v-if causes button background color to be
    // delayed when switching to v-else
    transition: none;
  }

  .link.remove:hover {
    color: $color-danger;
  }
}
</style>
