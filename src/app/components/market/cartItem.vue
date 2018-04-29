<template>
  <div class="item">
    <div class="title">
      <router-link :to="{ name: 'marketView', params: { type: (item.type === 'NODE_GROUP') ? 'group' : 'node', id: item.id } }" class="name">{{ item.data.friendly_name }}</router-link>
      <div class="type"><span v-if="item.type === 'NODE_GROUP'">Node Group</span><span v-else>Node</span></div>
    </div>
    <div class="price">
      {{ item.pricing[item.term === 'YEARLY' ? 'yearly' : 'monthly'] | currency}}
      <span class="renews">Renews {{ $i18n.t(`market.TERM.${item.term}`) }}</span>
    </div>

    <div class="savings">
      <template v-if="item.pricing.yearlyDiscount">
        <p v-if="item.term === 'YEARLY'" class="text-success">
          <span class="icon-check-circle"></span> By paying yearly, you're saving <strong>{{ item.pricing.yearlySavings | currency }}</strong>
        </p>
        <p v-else class="text-warning switch-yearly">
          <span class="icon-alert-circle"></span> By paying yearly, you could save <strong>{{ item.pricing.yearlySavings | currency }}</strong>
          <br>
          <span @click.stop="swithTermYearly" class="link">Switch to yearly</span>
        </p>
      </template>
    </div>

    <div class="actions">
      <span class="remove-button" @click.stop="remove">
        <span class="icon-x-circle"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    item: Object
  },
  methods: {
    ...mapActions({
      removeFromCart: 'cart/remove',
      changeTerm: 'cart/changeTerm'
    }),
    remove () {
      this.removeFromCart(this.item)
      this.$toasted.success(this.$i18n.t('market.REMOVED_FROM_CART', { name: this.item.data.friendly_name }))
    },
    swithTermYearly () {
      this.changeTerm({
        id: this.item.id,
        type: this.item.type,
        term: 'YEARLY'
      })
      this.$toasted.success(this.$i18n.t('market.SAVINGS_APPLIED'))
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 16px;
  padding-top: 0;
  line-height: 150%;
  border-bottom: 1px solid $color-border;

  > div {
    flex: 1;
    margin-right: $pad;

    &:last-child {
      margin-right: 0;
    }
  }
}
.title {
  .name {
    display: inline-block;
    margin-bottom: 4px;
    font-size: 135%;
    font-weight: $font-semi;
  }
  .type {
    margin-bottom: 0;
    font-size: 100%;
    font-weight: $font-regular;
  }
}
.price {
  max-width: 200px;
}
.renews {
  display: block;
  font-size: 100%;
  color: $color-light;
}
.savings {
  [class^="icon-"] {
    position: relative;
    top: 1px;
    margin-right: 3px;
  }
}
.switch-yearly {
  .link {
    color: $color-light;

    &:hover {
      color: $color-primary;
    }
  }
}
.actions {
  max-width: 50px;
  text-align: right;
}
.remove-button {
  display: inline-block;
  padding: 4px;
  font-size: 22px;
  line-height: 100%;
  color: lighten($color-light, 20%);
  cursor: pointer;

  &:hover {
    color: $color-danger;
  }
}
</style>
