<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Purchase {{ (item.type.toLowerCase() === 'node') ? 'Node' : 'Node Group' }}</h2>
      <button @click="$emit('close')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <h3>{{ item.friendly_name }}</h3>

      <div
        v-if="item.plan"
        v-html="$i18n.t(`market.PLAN_WARNING`, { planName: 'Spectero Pro', planUrl: 'https://spectero.com/pro' })"
        class="message message-brand">
      </div>

      <div
        v-if="item.type === 'NODE_GROUP'"
        v-html="$i18n.t(`market.ITEM_IS_GROUP_WARNING`, { count: item.nodes.length })"
        class="message message-group-warning">
      </div>

      <ul class="details">
        <li v-if="item.type === 'NODE_GROUP'">Total Nodes: <strong>{{ item.nodes.length }} Nodes</strong></li>
        <li v-if="item.asn">ASN: <strong>{{ item.asn }}</strong></li>
        <li v-if="item.city">City: <strong>{{ item.city }}</strong></li>
        <li v-if="item.cc">Country Code: <strong>{{ item.cc }}</strong></li>
        <li>Market Model: <strong>{{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}</strong></li>
        <li>Status: <strong>{{ $i18n.t(`nodes.STATUS.${item.status}`) }}</strong></li>
      </ul>

      <div class="actions">
        <router-link class="button button" :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }" v-on:click.native="$emit('close')">
          {{ $i18n.t('misc.VIEW_FULL_DETAILS') }}
        </router-link>
      </div>

      <div class="cart">
        <template v-if="!inCart || showChangeTerm">
          <div class="addToCart">
            <h5><span class="icon-shopping-cart"></span> {{ changeTerm ? 'Change term' : 'Purchase access' }}</h5>
            <div>
              <div class="terms">
                <div :class="{ active: term === 'MONTHLY' }" v-on:click="toggleTerm('MONTHLY')">
                  <label>Monthly</label>
                  <span class="price">{{ item.price | currency}} per month</span>
                </div>
                <div :class="{ active: term === 'YEARLY', unavailable: !item.plan }" v-on:click="item.plan ? toggleTerm('YEARLY') : false">
                  <label>Yearly</label>
                  <span class="price">
                    <template v-if="item.plan">
                      {{ yearlyPrice | currency }} per year
                    </template>
                    <template v-else>
                      Unavailable
                    </template>
                  </span>
                  <div v-if="this.plan && this.plan['yearly_discount_pct']" class="savings">Save {{ this.plan['yearly_discount_pct'] * 100 }}%</div>
                </div>
              </div>
              <div>
                <button @click.stop="showChangeTerm ? modifyTerm() : add()" class="button button-info"><span class="icon-shopping-cart"></span> {{ showChangeTerm ? $i18n.t('misc.CHANGE_TERM') : $i18n.t('misc.ADD_TO_CART') }}</button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="addedToCart">
            <h5><span class="icon-shopping-cart"></span> Added to your cart</h5>
            <div>
              <div class="details">
                <ul>
                  <li>
                    Price: <strong>{{ (term === 'YEARLY') ? yearlyPrice : item.price | currency }}</strong><br>
                    <span class="link remove" @click="remove">Remove from cart</span>
                  </li>
                  <li>
                    Term: <strong>{{ $i18n.t(`market.TERM.${term}`) }}</strong><br>
                    <span class="link" @click="showTerms">Change term</span>
                  </li>
                </ul>
              </div>
              <div>
                <button @click="$emit('close')" class="button">{{ $i18n.t('misc.CONTINUE_SHOPPING') }}</button>
                <router-link :to="{ name: 'cart' }" v-on:click.native="$emit('close')" class="button button-success"><span class="icon-check-circle"></span> {{ $i18n.t('misc.CHECKOUT') }}</router-link>
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
  data () {
    return {
      term: 'MONTHLY',
      showChangeTerm: false
    }
  },
  props: {
    item: Object
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
      this.$toasted.error(this.$i18n.t('market.REMOVED_FROM_CART', { name: this.item.friendly_name }))
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
      return price
    }
  },
  created: function () {
    if (this.inCart) {
      this.term = this.inCart.term
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  font-weight: $font-semi;
}
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
    font-weight: $font-semi;
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

  .button {
    // This "fixes" a bug where v-if causes button background color to be
    // delayed when switching to v-else
    transition: none;
  }

  .link.remove:hover {
    color: $color-danger;
  }
}
</style>
