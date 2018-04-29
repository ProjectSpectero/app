<template>
  <div>
    <top :title="item.friendly_name">
      <router-link :to="{ name: 'market' }" class="button">Back to Market</router-link>
      <button @click.stop="showModal(item)" class="button button-success" :class="{ 'button-bordered': existsInCart(item.id) }">
        <template v-if="existsInCart(item.id)">
          <span class="icon-check-circle"></span> {{ $i18n.t('misc.IN_CART') }}
        </template>
        <template v-else>
          <span class="icon-shopping-bag"></span> {{ $i18n.t('misc.PURCHASE') }}
        </template>
      </button>
    </top>
    <div class="container">
      <div class="col-info">
        <div class="info-box">
          <h5>Market Model</h5>
          <div>
            <div class="badge">{{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}</div>
            <div v-if="item.plan" class="badge badge-brand badge-plan">{{ item.plan }}</div>
          </div>
        </div>
        <div class="info-box">
          <h5>Status</h5>
          <div :class="'badge status-' + item.status">{{ $i18n.t(`nodes.STATUS.${item.status}`) }}</div>
        </div>
        <div class="info-box">
          <h5>IP Count</h5>
          <p v-if="item.ip_addresses">{{ item.ip_addresses.length }}</p>
          <p v-else>{{ countIpsInNodeGroup(item) }}</p>
        </div>
        <div class="info-box">
          <h5>Type</h5>
          <p v-if="item.type === 'NODE_GROUP'">Node Group</p>
          <p v-else>Node</p>
        </div>
        <div v-if="item.asn" class="info-box">
          <h5>ASN</h5>
          <p>{{ item.asn }}</p>
        </div>
        <div v-if="item.cc || item.city" class="info-box">
          <h5>Location</h5>
          <p>
            <template v-if="item.cc">{{ getCountryById(item.cc).name }}</template>
            <template v-if="item.city"> ({{ item.city }})</template>
          </p>
        </div>
        <div class="info-box">
          <h5>Price</h5>
          <p>{{ item.price | currency }} USD</p>
        </div>
      </div>
    </div>

    <template v-if="item.nodes">
      <h4>Nodes</h4>
      <nodes :nodes="item.nodes"></nodes>
    </template>

    <template v-if="item.ip_addresses">
      <h4>IP Addresses</h4>
      <ips :ips="item.ip_addresses" :showAddresses="false"></ips>
    </template>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import ips from '@/app/components/nodes/listIps'
import nodes from './nodes'
import notFound from '@/shared/components/notFound'
import addToCart from './addToCart'
import { mapGetters } from 'vuex'

export default {
  props: {
    item: Object,
    type: String
  },
  data () {
    return {
      columns: ['asn', 'cc', 'city'],
      sortableColumns: ['asn', 'cc', 'city'],
      filterableColumns: ['asn', 'cc', 'city'],
      headings: {
        asn: 'ASN',
        cc: 'Country Code',
        city: 'City'
      },
      options: {}
    }
  },
  computed: {
    ...mapGetters({
      cart: 'cart/cart',
      countries: 'settings/countries'
    })
  },
  methods: {
    existsInCart (id) {
      return this.cart.find(i => i.id === id)
    },
    showModal (item) {
      this.$modal.show(addToCart, {
        item: item
      }, {
        height: 'auto'
      })
    },
    countIpsInNodeGroup (group) {
      let ips = 0
      let nodes = 0

      group.nodes.forEach(node => {
        nodes++
        ips += node.ip_addresses.length
      })

      return this.$i18n.t('market.NODE_GROUP_IP_COUNT', { nodes: nodes, ips: ips })
    },
    getCountryById (id) {
      return this.countries.filter((obj) => {
        return obj.code === id
      })[0]
    }
  },
  created () {
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} IP addresses|{count} IP addresses|One IP address',
        filter: '',
        filterPlaceholder: 'Search IP addresses',
        limit: 'IP addresses:',
        page: 'Page:',
        noresult: 'This item has no IP addresses yet.',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      columnsClasses: {
        actions: 'table-actions'
      },
      perPage: 10,
      pagination: true,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }
  },
  metaInfo () {
    return {
      title: this.item.friendly_name
    }
  },
  components: {
    top,
    notFound,
    ips,
    nodes,
    addToCart
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-CONFIRMED, &.status-ENABLED {
    @extend .badge-success;
  }

  &.status-UNCONFIRMED, &.status-DISABLED {
    @extend .badge-error;
  }
}
</style>
