<template>
  <form class="filters" @submit.prevent.stop="submitFilters">
    <div class="form-input">
      <div class="label"><label for="market-model">Market Model</label></div>
      <select name="market-model" id="market-model" v-model="nodes.market_model" @change="changeConditionalFilter('market_model', '=')">
        <option value="" selected>Any Type</option>
        <option value="LISTED_SHARED">Shared</option>
        <option value="LISTED_DEDICATED">Dedicated</option>
      </select>
    </div>

    <div class="form-input">
      <div class="label"><label for="market-asn">ASN</label></div>
      <input type="text" name="market-asn" id="market-asn" v-model="nodes.asn" @keyup="changeNumericInFilter('asn')" class="input">
    </div>

    <div class="form-input">
      <div class="label"><label>Grouped Results</label></div>
      <div class="form-checkbox">
        <label for="filter-grouped">
          <input id="filter-grouped" type="checkbox" v-model="nodes.grouped" @change="update">
          Show Grouped Results
        </label>
      </div>
    </div>

    <div class="form-input">
      <div class="label"><label>Service Types</label></div>
      <div class="form-checkbox" :for="'service-type-' + type" v-for="type in serviceTypes" :key="type">
        <label :for="'service-type-' + type">
          <input :id="'service-type-' + type" type="checkbox" @change="toggleServiceType(type)">
          {{ type }}
        </label>
      </div>
    </div>

    <div class="form-input">
      <div class="label"><label>Price Range</label></div>
      <vue-slider ref="slider-price" v-bind="sliders.price" v-model="sliders.price.value" class="slider" v-on:callback="filterPriceRange">
        <template slot="label" slot-scope="{ label, active }">
          <span :class="['custom-label', { active }]" v-if="label % 25 === 0">
            ${{ label }}{{ (parseInt(label) === sliders.price.maxValue) ? '+' : '' }}
          </span>
        </template>
      </vue-slider>
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-country">Country</label></div>
      <select id="filter-country" v-model="nodes.cc" @change="filterCountryCode">
        <option value="" selected>Any Country</option>
        <option disabled>&nbsp;</option>
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-city">City</label></div>
      <input type="text" id="filter-city" v-model="nodes.city" @keyup="changeConditionalFilter('city', '=')" class="input">
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-nodeCount">Minimum number of IP addresses</label></div>
      <input type="number" id="filter-nodeCount" v-model="nodes.ip_count" @keyup="filterIPCount" @change="filterIPCount" class="input" min="0">
    </div>

    <input
      type="submit"
      class="button button-md max-width buttonFilterSubmit"
      :class="{ 'button-success': this.filtersChanged }"
      :disabled="!this.filtersChanged"
      value="Apply Filters">
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import vueSlider from 'vue-slider-component'

export default {
  data () {
    return {
      serviceTypes: ['HTTPProxy', 'OpenVPN'],
      nodes: {
        market_model: '',
        price: null,
        asn: null,
        city: null,
        cc: '',
        service_type: [],
        ip_count: null,
        grouped: true
      },
      sliders: {
        price: {
          maxValue: 100,
          value: [0, 0],
          width: '100%',
          height: 8,
          dotSize: 16,
          min: 0,
          max: 0,
          interval: 0,
          disabled: false,
          show: true,
          useKeyboard: true,
          piecewiseLabel: true,
          tooltip: false,
          formatter: '{value}',
          bgStyle: {
            backgroundColor: '#f3f3f3'
          },
          processStyle: {
            backgroundColor: '#0747A6'
          },
          lazy: true
        }
      },
      filtersChanged: false
    }
  },
  created () {
    this.$set(this.sliders.price, 'value', [0, this.sliders.price.maxValue])
    this.$set(this.sliders.price, 'interval', this.sliders.price.maxValue / 4)
    this.$set(this.sliders.price, 'max', this.sliders.price.maxValue)
    this.setupForm()
  },
  computed: {
    ...mapGetters({
      filters: 'marketplace/filters',
      countries: 'settings/countries'
    })
  },
  methods: {
    ...mapActions({
      removeFilter: 'marketplace/removeFilter',
      updateFilter: 'marketplace/updateFilter'
    }),
    setupForm () {
      const marketModel = this.find('market_model')
      const asn = this.find('asn')
      const ipCount = this.find('ip_count')
      const cc = this.find('cc')
      const city = this.find('city')

      // To do: service types, grouped, price range
      // Also: fix empty values on inputs not triggering a change

      console.log('this.filters', this.filters)
      console.log('this.nodes', this.nodes)

      if (marketModel && marketModel.value !== this.nodes.market_model) {
        this.nodes.market_model = marketModel.value
      }

      if (asn && asn.value.length && asn.value[0] !== this.nodes.asn) {
        this.nodes.asn = asn.value[0]
      }

      if (cc && cc.value !== this.nodes.cc) {
        this.nodes.cc = cc.value
      }

      if (city && city.value !== this.nodes.city) {
        this.nodes.city = city.value
      }

      if (ipCount && ipCount.value !== this.nodes.ip_count) {
        this.nodes.ip_count = ipCount.value
      }
    },
    findIndex (field) {
      return this.filters.findIndex(r => r.field === 'nodes.' + field)
    },
    find (field) {
      return this.filters.find(r => r.field === 'nodes.' + field)
    },
    update (filter, index) {
      this.updateFilter({ filter: filter, index: index })
      this.filtersChanged = true
    },
    submitFilters () {
      this.$emit('changedFilters')
      this.filtersChanged = false
    },
    changeConditionalFilter (field, operator) {
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: operator,
        value: this.nodes[field]
      }

      if (filter.value === '') {
        this.removeFilter(index)
      } else {
        this.update(filter, index)
      }
    },
    changeNumericInFilter (field) {
      const index = this.findIndex(field)

      if (!this.nodes[field] || this.nodes[field].length === 0) {
        this.removeFilter(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'IN',
          value: [parseInt(this.nodes[field])]
        }

        this.update(filter, index)
      }
    },
    changeServiceTypeFilter () {
      const field = 'service_type'
      const index = this.findIndex(field)

      if (!this.nodes[field] || this.nodes[field].length === 0) {
        this.removeFilter(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'ALL',
          value: this.nodes[field]
        }

        this.update(filter, index)
      }
    },
    toggleServiceType (type) {
      const serviceTypeIndex = this.nodes.service_type.findIndex(s => s === type)

      if (serviceTypeIndex !== -1) {
        this.nodes.service_type.splice(serviceTypeIndex, 1)
      } else {
        this.nodes.service_type.push(type)
      }

      this.changeServiceTypeFilter()
    },
    filterPriceRange (range) {
      const index = this.findIndex('price')

      // Remove price if min = 0 and max = slider maxValue value
      if (range[0] === 0 && range[1] === this.sliders.price.maxValue) {
        this.removeFilter(index)
      } else {
        const filter = {
          field: 'nodes.price',
          operator: 'RANGE',
          value: {
            start: range[0],
            end: range[1]
          }
        }

        this.update(filter, index)
      }
    },
    filterIPCount () {
      const field = 'ip_count'
      const index = this.findIndex(field)
      if (!this.nodes[field] || this.nodes[field] === '0') {
        this.removeFilter(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: '>=',
          value: parseInt(this.nodes[field])
        }

        this.update(filter, index)
      }
    },
    filterCountryCode () {
      const field = 'cc'
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: 'IN',
        value: [this.nodes[field]]
      }

      if (this.nodes[field] === '') {
        this.removeFilter(index)
      } else {
        this.update(filter, index)
      }
    }
  },
  components: {
    vueSlider
  }
}
</script>

<style lang="scss" scoped>
.slider {
  margin-top: 30px;
}
.custom-label {
  position: absolute;
  bottom: 120%;
  left: 0;
  transform: translate(-50%, -12px);
  margin-left: 3px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 5px);
    width: 1px;
    height: 5px;
    background-color: #ccc;
  }
  &.active {
    color: $color-info;
    font-weight: $font-bold;

    &::after {
      width: 2px;
      background-color: $color-info;
    }
  }
}
</style>
