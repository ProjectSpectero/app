<template>
  <div>
    <top :title="$i18n.t('misc.MARKET')">
      <router-link :to="{ name: 'cart' }" v-if="totals.total > 0" class="button">
        {{ $i18n.t('misc.VIEW_CART') }}
      </router-link>
      <help-button obj="market.topics"></help-button>
    </top>

    <div class="container content-split">
      <div class="split-item split-list">
        <filters @changedFilters="search"></filters>
      </div>
      <div class="market-listings split-item split-details">
        <div v-if="storeLoading" class="loading-overlay">
          <loading></loading>
        </div>

        <div class="cart" v-if="totals.total > 0">
          <div class="info">
            <h4 class="mb-0"><span class="icon icon-shopping-cart"></span> {{ $i18n.t('misc.CART') }}: {{ totals.total | currency }} USD</h4>
          </div>
          <div class="actions">
            <router-link :to="{ name: 'cart' }" class="button button-info">
              {{ $i18n.t('misc.CHECKOUT') }}
            </router-link>
          </div>
        </div>

        <div class="datatable">
          <table>
            <table-header :columns="columns" :headings="headings" :sortable="sortable"/>
            <tbody>
              <tr v-for="(item, index) in results" :key="index">
                <td>
                  {{ item.friendly_name }}
                  <div v-if="item.plan" class="badge badge-brand badge-plan">{{ item.plan }}</div>
                </td>
                <td>
                  <div class="badge">{{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}</div>
                </td>
                <td>
                  <span v-if="item.ip_addresses">{{ item.ip_addresses.length }}</span>
                  <span v-else>{{ countIpsInNodeGroup(item) }}</span>
                </td>
                <td>
                  <span v-if="item.type === 'NODE_GROUP'">Node Group</span>
                  <span v-else>Node</span>
                </td>
                <td>{{ item.price | currency }} USD</td>
                <td class="table-actions">
                  <button @click.stop="showModal(item)" class="button button-sm button-success" :class="{ 'button-bordered': existsInCart(item.id) }">
                    <template v-if="existsInCart(item.id)">
                      <span class="icon-check-circle"></span> {{ $i18n.t('misc.IN_CART') }}
                    </template>
                    <template v-else>
                      <span class="icon-shopping-bag"></span> {{ $i18n.t('misc.PURCHASE') }}
                    </template>
                  </button>

                  <router-link class="button button-sm" :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }">
                    {{ $i18n.t('misc.VIEW') }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <paginator :pagination="pagination" @changedPage="search"></paginator>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import filters from './filters'
import addToCart from './addToCart'
import top from '@/shared/components/top'
import paginator from '@/shared/components/paginator'
import loading from '@/shared/components/loading'
import tableHeader from '@/shared/components/table/thead'
import helpButton from '@/shared/components/docs/button'

export default {
  data () {
    return {
      perPage: 10,
      columns: ['friendly_name', 'market_model', 'ips_count', 'type', 'price', 'actions'],
      headings: {
        friendly_name: 'Name',
        market_model: 'Market Model',
        ips_count: 'IP Count',
        type: 'Type',
        price: 'Price',
        actions: ''
      },
      sortable: [],
      filters: [],
      grouped: true
    }
  },
  async created () {
    await this.fetchPlans()
    await this.refreshCart()

    this.search()
  },
  computed: {
    ...mapGetters({
      cart: 'cart/cart',
      results: 'market/results',
      pagination: 'market/pagination',
      storeLoading: 'market/loading',
      totals: 'cart/totals'
    })
  },
  methods: {
    ...mapActions({
      fetch: 'market/fetch',
      fetchPlans: 'market/fetchPlans',
      refreshCart: 'cart/refresh'
    }),
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
    search (page) {
      this.fetch({ page: page || 1, perPage: this.perPage, grouped: this.grouped })
    }
  },
  metaInfo: {
    title: 'Market'
  },
  components: {
    top,
    paginator,
    tableHeader,
    filters,
    addToCart,
    loading,
    helpButton
  }
}
</script>

<style lang="scss" scoped>
.market-listings {
  position: relative;

  .loading-overlay {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(255,255,255,0.75);
  }
}
.cart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 14px;
  background: $white;
  border: 1px solid $color-border;
  border-radius: 4px;

  h4 {
    font-size: 120%;
  }
  .icon {
    margin-right: 6px;
  }
}
.badge-plan {
  margin-left: 4px;
}
</style>
