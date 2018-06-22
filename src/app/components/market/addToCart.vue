<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('misc.PURCHASE') }} {{ (item.type.toLowerCase() === 'node') ? $i18n.t('misc.NODE') : $i18n.t('misc.NODE_GROUP') }}</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <h3>{{ item.friendly_name }}</h3>

      <div
        v-if="item.plan"
        class="message message-success"
        v-html="$i18n.t(`market.PLAN_PURCHASE_MSG`, { planName: 'Spectero Pro', planUrl: 'https://spectero.com/pro' })"/>

      <div
        v-if="item.type === 'NODE_GROUP'"
        class="message message message-group-warning"
        v-html="$i18n.t(`market.ITEM_IS_GROUP_WARNING`, { count: item.nodes.length })"/>

      <ul class="details">
        <li v-if="item.type === 'NODE_GROUP'">
          {{ $i18n.t('misc.TOTAL_NODES') }}: <strong>{{ item.nodes.length }} {{ $i18n.t('misc.NODES') }}</strong>
        </li>
        <li v-if="item.asn">{{ $i18n.t('misc.ASN') }}: <strong>{{ item.asn }}</strong></li>
        <li v-if="item.city">{{ $i18n.t('misc.CITY') }}: <strong>{{ item.city }}</strong></li>
        <li v-if="item.cc">{{ $i18n.t('misc.CC') }}: <strong>{{ item.cc }}</strong></li>
        <li>{{ $i18n.t('misc.MARKET_MODEL') }}: <strong>{{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}</strong></li>
      </ul>

      <div class="actions">
        <router-link
          :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }"
          class="button-info"
          @click.native="$emit('close')">
          {{ $i18n.t('misc.VIEW_FULL_DETAILS') }}
        </router-link>
      </div>

      <div class="cart">
        <template v-if="!inCart || showChangeTerm">
          <div class="addToCart">
            <h5>
              {{ showChangeTerm ? $i18n.t('market.CHANGE_TERM') : $i18n.t('market.PURCHASE_ACCESS') }}
            </h5>
            <div>
              <div class="terms">
                <div
                  :class="{ active: term === 'MONTHLY' }"
                  @click="toggleTerm('MONTHLY')">
                  <label>{{ $i18n.t('market.TERM.MONTHLY') }}</label>
                  <span class="price">{{ item.price | currency }} {{ $i18n.t('market.PER_MONTH') }}</span>
                </div>
                <div
                  :class="{ active: term === 'YEARLY', unavailable: !item.plan }"
                  @click="item.plan ? toggleTerm('YEARLY') : false">
                  <label>{{ $i18n.t('market.TERM.YEARLY') }}</label>
                  <span class="price">
                    <template v-if="item.plan">
                      {{ yearlyPrice | currency }} {{ $i18n.t('market.PER_YEAR') }}
                    </template>
                    <template v-else>
                      {{ $i18n.t('market.UNAVAILABLE') }}
                    </template>
                  </span>
                  <div
                    v-if="plan && plan['yearly_discount_pct']"
                    class="savings">
                    {{ $i18n.t('misc.SAVE') }} {{ plan['yearly_discount_pct'] * 100 }}%
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="button-success"
                  @click.stop="showChangeTerm ? modifyTerm() : add()">
                  <span class="icon-shopping-cart"/> {{ showChangeTerm ? $i18n.t('market.CHANGE_TERM') : $i18n.t('misc.ADD_TO_CART') }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="addedToCart">
            <h5>
              <span class="icon-shopping-cart"/> {{ $i18n.t('market.ADDED_TO_YOUR_CART') }}
            </h5>
            <div>
              <div class="details">
                <ul>
                  <li>
                    {{ $i18n.t('misc.PRICE') }}: <strong>{{ (term === 'YEARLY') ? yearlyPrice : item.price | currency }}</strong><br>
                    <span
                      class="link remove"
                      @click="remove">
                      {{ $i18n.t('market.REMOVE_FROM_CART') }}
                    </span>
                  </li>
                  <li>
                    {{ $i18n.t('misc.TERM') }}: <strong>{{ $i18n.t(`market.TERM.${term}`) }}</strong><br>
                    <span
                      class="link"
                      @click="showTerms">
                      {{ $i18n.t('market.CHANGE_TERM') }}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <button
                  class="button"
                  @click="$emit('close')">
                  {{ $i18n.t('misc.CONTINUE_SHOPPING') }}
                </button>
                <router-link
                  :to="{ name: 'cart' }"
                  class="button-success"
                  @click.native="$emit('close')">
                  <span class="icon-check-circle"/> {{ $i18n.t('misc.CHECKOUT') }}
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
import { mapActions } from 'vuex'

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
  created: function () {
    if (this.inCart) {
      this.term = this.inCart.term
    }
  },
  methods: {
    ...mapActions({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove',
      changeTerm: 'cart/changeTerm',
      refreshCart: 'cart/refresh'
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
        this.$toasted.success(this.$i18n.t('market.ADDED_TO_CART', { name: this.item.friendly_name }))
      } catch (e) {
        this.$toasted.error(this.$i18n.t(`market.${e.message}`, { name: this.item.friendly_name }))
      }
    },
    remove () {
      this.removeFromCart(this.item)
      this.$toasted.show(this.$i18n.t('market.REMOVED_FROM_CART', { name: this.item.friendly_name }))
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
      this.$toasted.info(this.$i18n.t('market.TERM_MODIFIED'))
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
    margin-bottom: 16px;

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
