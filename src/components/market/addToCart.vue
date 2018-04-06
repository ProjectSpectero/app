<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Purchase {{ (item.type.toLowerCase() === 'node') ? 'Node' : 'Node Group' }}</h2>
      <button class="modal-close" @click="$emit('close')"></button>
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
        <li>Price: <strong>{{ item.price | currency }} USD</strong></li>
      </ul>

      <div class="actions">
        <router-link class="button" :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }" v-on:click.native="$emit('close')">
          {{ $i18n.t('misc.VIEW_FULL_DETAILS') }}
        </router-link>
        <div class="right">
          <button @click.stop="add(item, true)" class="button">{{ $i18n.t('misc.BUY_NOW') }}</button>
          <button @click.stop="add(item, false)" class="button button-success">{{ $i18n.t('misc.ADD_TO_CART') }}</button>
        </div>
      </div>
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
      addToCart: 'market/addToCart'
    }),
    add (item, checkout) {
      this.addToCart(item)
      this.$emit('close')
      this.$toasted.success(item.friendly_name + ' added to cart!')

      if (checkout) {
        this.$router.push({ name: 'cart' })
      }
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
</style>
