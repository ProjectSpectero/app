<template>
  <div>
    <top :title="$i18n.t('misc.MARKET')">
      <router-link
        v-if="totals.total > 0"
        :to="{ name: 'cart' }"
        class="button">
        {{ $i18n.t('misc.VIEW_CART') }}
      </router-link>
      <help-button obj="market.topics"/>
      <market-menu
        slot="tabs"
        @selectedRoute="switchListing"/>
    </top>

    <div class="container">
      <div class="content-split col-12">
        <div
          v-if="route !== 'marketMine'"
          class="split-list">
          <filters @changedFilters="search"/>
        </div>
        <div
          :class="{ 'no-space': route === 'marketMine' }"
          class="market-listings split-details">
          <div
            v-if="storeLoading"
            :class="{ 'loading-overlay': route !== 'marketMine' }">
            <loading/>
          </div>

          <div
            v-if="!storeLoading && totals.total > 0 && route !== 'marketMine'"
            class="cart">
            <div class="info">
              <h4 class="mb-0">
                <span class="icon icon-shopping-cart"/> {{ $i18n.t('misc.CART') }}: {{ totals.total | currency }} USD
              </h4>
            </div>
            <div class="actions">
              <router-link
                :to="{ name: 'cart' }"
                class="button-info">
                {{ $i18n.t('misc.CHECKOUT') }}
              </router-link>
            </div>
          </div>

          <div
            v-if="results.length > 0"
            class="datatable">
            <table>
              <table-header
                :columns="columns"
                :headings="headings"
                :sortable="sortable"/>
              <tbody>
                <tr
                  v-for="(item, index) in results"
                  :key="index">
                  <td>
                    <flag
                      v-if="item.cc"
                      :iso="item.cc"
                      :squared="false" />
                    <div
                      v-else
                      class="flag-icon-empty">2+</div>
                    {{ item.friendly_name }}
                    <div
                      v-if="item.plan"
                      class="badge badge-brand badge-plan">{{ item.plan }}</div>
                  </td>
                  <td>
                    <div class="badge">{{ $i18n.t(`market.MODEL_NODE.${item.market_model}`) }}</div>
                  </td>
                  <td>
                    <template v-if="route === 'marketMine'">
                      <span>{{ item.ip }}</span>
                    </template>
                    <template v-else>
                      <span v-if="item.ip_addresses">{{ item.ip_addresses.length }}</span>
                      <span v-else-if="item.nodes">{{ countIpsInNodeGroup(item) }}</span>
                    </template>
                  </td>
                  <td>
                    <span v-if="item.type === 'NODE_GROUP'">{{ $i18n.t('misc.NODE_GROUP') }}</span>
                    <span v-else>{{ $i18n.t('misc.NODE') }}</span>
                  </td>
                  <td>{{ item.price | currency }} USD</td>
                  <td class="table-actions">
                    <template v-if="route === 'marketMine'">
                      <router-link
                        :to="{ name: 'node', params: { action: 'edit', id: item.id } }"
                        class="button-sm">
                        {{ $i18n.t('misc.EDIT') }}
                      </router-link>
                    </template>
                    <template v-else>
                      <button
                        :class="{ 'button-bordered': existsInCart(item.id) }"
                        class="button-sm button-success"
                        @click.stop="showModal(item)">
                        <template v-if="existsInCart(item.id)">
                          <span class="icon-check-circle"/> {{ $i18n.t('misc.IN_CART') }}
                        </template>
                        <template v-else>
                          <span class="icon-shopping-bag"/> {{ $i18n.t('misc.PURCHASE') }}
                        </template>
                      </button>

                      <router-link
                        v-if="item.type"
                        :to="{ name: 'marketView', params: { type: ((item.type.toLowerCase() === 'node') ? 'node' : 'group'), id: item.id } }"
                        class="button-sm">
                        {{ $i18n.t('misc.VIEW') }}
                      </router-link>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-else-if="!storeLoading"
            class="alert-msg-centered">
            <div class="icon-slash big-icon"/>
            <template v-if="route !== 'marketMine'">
              <h1>{{ $i18n.t('market.NO_LISTINGS_TITLE') }}</h1>
              <p>{{ $i18n.t('market.NO_LISTINGS_TEXT') }}</p>
            </template>
            <template v-else>
              <h1>{{ $i18n.t('market.NO_LISTINGS_SELF_TITLE') }}</h1>
              <p>{{ $i18n.t('market.NO_LISTINGS_SELF_TEXT') }}</p>
              <button
                class="button-success"
                @click.prevent="showAddNodeModal()">
                <span class="icon-plus"/>{{ $i18n.t('nodes.ADD_NODE') }}
              </button>
            </template>
          </div>

          <paginator
            v-if="results.length > 0"
            :pagination="pagination"
            @changedPage="search"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import filters from './filters'
import addToCart from './addToCart'
import marketMenu from './marketMenu'
import top from '@/shared/components/top'
import paginator from '@/shared/components/paginator'
import loading from '@/shared/components/loading'
import tableHeader from '@/shared/components/table/thead'
import helpButton from '@/shared/components/docs/button'
import addNodeModal from '../nodes/addNodeModal'

export default {
  components: {
    top,
    marketMenu,
    paginator,
    tableHeader,
    filters,
    addToCart,
    loading,
    helpButton,
    addNodeModal
  },
  metaInfo: {
    title: 'Market'
  },
  data () {
    return {
      perPage: 10,
      columns: ['friendly_name', 'market_model', 'ips_count', 'type', 'price', 'actions'],
      headings: {
        friendly_name: 'Name',
        market_model: 'Market Model',
        ips_count: 'IP',
        type: 'Type',
        price: 'Price',
        actions: ''
      },
      sortable: [],
      filters: [],
      grouped: true,
      route: 'marketListed'
    }
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
  async created () {
    await this.fetchPlans()
    await this.refreshCart()

    if (this.$route.name === 'market') {
      this.switchListing('marketListed')
    } else {
      this.switchListing(this.$route.name, this.$route.params.page)
    }
  },
  methods: {
    ...mapActions({
      fetch: 'market/fetch',
      fetchMine: 'market/fetchMine',
      fetchPlans: 'market/fetchPlans',
      refreshCart: 'cart/refresh'
    }),
    showAddNodeModal () {
      this.$modal.show(addNodeModal, {}, {
        height: 'auto'
      })
    },
    switchListing (route, page) {
      this.route = route
      this.search(page || 1, route)
    },
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
    search (page, route) {
      const p = page || this.$route.params.page || 1
      const r = route || this.$route.name

      if (this.route === 'marketMine') {
        this.fetchMine({ page: p, perPage: this.perPage })
      } else {
        this.fetch({ page: p, perPage: this.perPage, grouped: this.grouped })
      }

      this.$router.push({ name: r, params: { page: p } })
    }
  }
}
</script>

<style lang="scss" scoped>
.market-listings {
  position: relative;

  .loading-overlay {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(255,255,255,0.75);
  }
  .flag-icon {
    position: relative;
    top: -1px;
    margin-right: 8px;
    width: 1.5em;
    line-height: 1.2em;
  }
  .flag-icon-empty {
    width: 21px;
    height: 16px;
    position: relative;
    top: -1px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    color: rgba(0,0,0,0.5);
    font-weight: $font-bold;
    font-size: 13px;
    background: #EEE;
    cursor: default;
    pointer-events: none;
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
