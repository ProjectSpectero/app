<template>
  <div>
    <top :title="item.friendly_name">
      <router-link
        :to="{ name: 'market' }"
        class="button">
        {{ $t('market.BACK') }}
      </router-link>
      <button
        :class="{ 'button-bordered': existsInCart(item.id) }"
        class="button-success"
        @click.stop="showModal(item)">
        <template v-if="existsInCart(item.id)">
          <span class="icon-check-circle"/> {{ $t('misc.IN_CART') }}
        </template>
        <template v-else>
          <span class="icon-shopping-bag"/> {{ $t('misc.PURCHASE') }}
        </template>
      </button>

      <div
        slot="sub"
        class="sub">
        <div class="col-info">
          <div class="info-box">
            <h5>{{ $t('misc.MARKET_MODEL') }}</h5>
            <div>
              <div class="badge">{{ $t(`market.MODEL_NODE.${item.market_model}`) }}</div>
              <div
                v-if="item.plan"
                class="badge badge-brand badge-plan">{{ item.plan }}</div>
            </div>
          </div>
          <div
            v-if="item.type === 'NODE' && item.services.length > 0"
            class="info-box">
            <h5>{{ $t('misc.SERVICES') }}</h5>
            <div
              v-for="service in item.services"
              :key="service"
              class="badge">{{ service }}</div>
          </div>
          <div class="info-box">
            <h5>{{ $t('misc.IP_COUNT') }}</h5>
            <p v-if="item.ip_addresses">{{ item.ip_addresses.length }}</p>
            <p v-else>{{ countIpsInNodeGroup(item) }}</p>
          </div>
          <div class="info-box">
            <h5>{{ $t('misc.TYPE') }}</h5>
            <p v-if="item.type === 'NODE_GROUP'">{{ $t('misc.NODE_GROUP') }}</p>
            <p v-else>{{ $t('misc.NODE') }}</p>
          </div>
          <div
            v-if="item.asn"
            class="info-box">
            <h5>{{ $t('misc.ASN') }}</h5>
            <p>{{ item.asn }}</p>
          </div>
          <div
            v-if="item.cc || item.city"
            class="info-box">
            <h5>{{ $t('misc.LOCATION') }}</h5>
            <p>
              <template v-if="item.cc">{{ getCountryById(item.cc).name }}</template>
              <template v-if="item.city"> ({{ item.city }})</template>
            </p>
          </div>
          <div class="info-box">
            <h5>{{ $t('misc.PRICE') }}</h5>
            <p>{{ item.price | currency }} USD</p>
          </div>
        </div>
      </div>
    </top>
    <div class="container">
      <div class="col-12">
        <template v-if="item.nodes">
          <div class="section padded">
            <h4>{{ $t('misc.NODES') }}</h4>
            <nodes :nodes="item.nodes"/>
          </div>
        </template>
        <template v-if="item.ip_addresses">
          <ips
            :ips="item.ip_addresses"
            :show-addresses="false"/>
        </template>
      </div>
    </div>
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
  components: {
    top,
    notFound,
    ips,
    nodes,
    addToCart
  },
  metaInfo () {
    return {
      title: this.item.friendly_name
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
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

      return this.$t('market.NODE_GROUP_IP_COUNT', { nodes: nodes, ips: ips })
    }
  }
}
</script>
