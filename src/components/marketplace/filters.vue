<template>
  <form class="filters" @submit.prevent.stop="">
    <div class="form-input">
      <div class="label"><label for="market-model">Node Type</label></div>
      <select name="market-model" id="market-model" v-model="nodes.market_model" @change="changeConditionalFilter('market_model', '=')">
        <option value="null" selected>Any Type</option>
        <option value="LISTED_SHARED">Shared</option>
        <option value="LISTED_DEDICATED">Dedicated</option>
      </select>
    </div>

    <div class="form-input">
      <div class="label"><label for="market-asn">ASN</label></div>
      <input type="text" name="market-asn" id="market-asn" v-model="nodes.asn" class="input">
      <button @click="changeInFilter('asn')">Apply</button>
    </div>

    <div class="form-input">
      <div class="label"><label>Service Types</label></div>
      <div class="form-checkbox" :for="'service-type-' + type" v-for="type in serviceTypes" :key="type">
        <input :id="'service-type-' + type" type="checkbox" @change="toggleServiceType(type)">
        <label :for="'service-type-' + type">{{ type }}</label>
      </div>
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-price">Price Range</label></div>
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
      <select id="filter-country" v-model="nodes.cc" @change="filterCountryCode()">
        <option value="null" selected>Any Country</option>
        <option disabled>&nbsp;</option>
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-city">City</label></div>
      <input type="text" v-model="nodes.city" id="filter-city" class="input">
      <button @click="changeConditionalFilter('city', '=')">Apply</button>
    </div>

    <div class="form-input">
      <div class="label"><label for="filter-nodeCount">Minimum number of IP addresses</label></div>
      <input type="number" v-model="nodes.ip_count" id="filter-nodeCount" class="input">
      <button @click="filterIPCount">Apply</button>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import vueSlider from 'vue-slider-component'

export default {
  data () {
    return {
      serviceTypes: ['HTTPProxy', 'OpenVPN'],
      nodes: {
        market_model: null,
        price: null,
        asn: null,
        city: null,
        cc: null,
        service_type: [],
        ip_count: null
      },
      rules: [],
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
            backgroundColor: '#44BD32'
          },
          lazy: true
        }
      }
    }
  },
  methods: {
    findIndex (field) {
      return this.rules.findIndex(r => r.field === 'nodes.' + field)
    },
    find (field) {
      return this.rules.find(r => r.field === 'nodes.' + field)
    },
    clearFilter (index) {
      this.rules.splice(index, 1)
      this.updateFilters()
    },
    updateFilters (filter, index) {
      // Update pre-filled filter with the new value and operator
      // or create a new instance of it
      if (index !== -1) {
        this.rules[index] = filter
      } else {
        this.rules.push(filter)
      }

      console.log('changed rules', this.rules)

      this.$emit('changedRules', this.rules)
    },
    changeConditionalFilter (field, operator) {
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: operator,
        value: this.nodes[field]
      }

      if (filter.value === 'null') {
        this.clearFilter(index)
      } else {
        this.updateFilters(filter, index)
      }
    },
    changeInFilter (field) {
      const index = this.findIndex(field)

      if (!this.nodes[field]) {
        this.clearFilter(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'IN',
          value: [this.nodes[field]]
        }

        this.updateFilters(filter, index)
      }
    },
    changeServiceTypeFilter () {
      const field = 'service_type'
      const index = this.findIndex(field)

      if (!this.nodes[field] || this.nodes[field].length === 0) {
        this.clearFilter(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'ALL',
          value: this.nodes[field]
        }

        console.log(field, ' filter is now ', filter)

        this.updateFilters(filter, index)
      }
    },
    toggleServiceType (type) {
      const serviceTypeIndex = this.nodes.service_type.findIndex(s => s === type)

      if (serviceTypeIndex !== -1) {
        this.nodes.service_type.splice(serviceTypeIndex, 1)
      } else {
        this.nodes.service_type.push(type)
      }

      console.log('Pushed service type', this.nodes.service_type)
      this.changeServiceTypeFilter()
    },
    filterPriceRange (range) {
      const index = this.findIndex('price')

      // Remove price if min = 0 and max = slider maxValue value
      if (range[0] === 0 && range[1] === this.sliders.price.maxValue) {
        this.clearFilter(index)
      } else {
        const filter = {
          field: 'nodes.price',
          operator: 'RANGE',
          value: {
            start: range[1],
            end: range[0]
          }
        }

        this.updateFilters(filter, index)
      }
    },
    filterIPCount () {
      const field = 'ip_count'
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: '>=',
        value: parseInt(this.nodes[field])
      }

      this.updateFilters(filter, index)
    },
    filterCountryCode () {
      const field = 'cc'
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: 'IN',
        value: [this.nodes[field]]
      }

      if (this.nodes[field] === 'null') {
        this.clearFilter(index)
      } else {
        this.updateFilters(filter, index)
      }
    }
  },
  computed: {
    ...mapGetters({
      countries: 'settings/countries'
    })
  },
  created () {
    this.$set(this.sliders.price, 'value', [0, this.sliders.price.maxValue])
    this.$set(this.sliders.price, 'interval', this.sliders.price.maxValue / 4)
    this.$set(this.sliders.price, 'max', this.sliders.price.maxValue)
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
    color: $color-success;
    font-weight: $font-bold;

    &::after {
      width: 2px;
      background-color: $color-success;
    }
  }
}
</style>
