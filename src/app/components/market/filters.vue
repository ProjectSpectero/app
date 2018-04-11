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
          <input id="filter-grouped" type="checkbox" v-model="nodes.grouped" @change="toggleGrouped">
          Show Grouped Results
        </label>
      </div>
    </div>

    <div class="form-input">
      <div class="label"><label>Service Types</label></div>
      <div class="form-checkbox" :for="type" v-for="type in serviceTypes" :key="type">
        <label :for="type">
          <input :id="type" type="checkbox" :checked="isServiceTypeSelected(type)" @change="toggleServiceType(type)">
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
      :class="{ 'button-success': this.buttonEnabled }"
      :disabled="!this.buttonEnabled"
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
        asn: null,
        city: null,
        cc: '',
        price: null,
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
      }
    }
  },
  created () {
    this.setupSlider()
    this.setupForm()
  },
  computed: {
    ...mapGetters({
      filters: 'market/filters',
      grouped: 'market/grouped',
      countries: 'settings/countries',
      buttonEnabled: 'market/buttonEnabled'
    })
  },
  methods: {
    ...mapActions({
      removeFilter: 'market/removeFilter',
      updateFilter: 'market/updateFilter',
      updateGrouped: 'market/updateGrouped',
      toggleButton: 'market/toggleButton'
    }),
    setupSlider () {
      this.$set(this.sliders.price, 'value', [0, this.sliders.price.maxValue])
      this.$set(this.sliders.price, 'interval', this.sliders.price.maxValue / 4)
      this.$set(this.sliders.price, 'max', this.sliders.price.maxValue)
    },
    setupForm () {
      const price = this.find('price')
      let serviceType = this.find('service_type')
      const basicFields = [
        'market_model',
        'cc',
        'city',
        'ip_count',
        'asn'
      ]

      for (let field in basicFields) {
        const obj = this.find(basicFields[field])

        if (obj !== undefined && obj && obj.value !== this.nodes[basicFields[field]]) {
          this.$set(this.nodes, basicFields[field], ((obj instanceof Array) ? obj[0].value : obj.value))
        }
      }

      // 'grouped' is not a filter, we need to update it manually
      this.$set(this.nodes, 'grouped', this.grouped)

      // Price range slider
      if (price && price.value !== this.nodes.price) {
        this.nodes.price = price.value
        this.$set(this.sliders.price, 'value', [this.nodes.price.start, this.nodes.price.end])
      }

      // (Multiple) service_type checkboxes
      if (serviceType && serviceType.value.length && serviceType.value !== this.nodes.service_type) {
        this.nodes.service_type = serviceType.value
      }
    },
    findIndex (field) {
      return this.filters.findIndex(r => r.field === 'nodes.' + field)
    },
    find (field) {
      return this.filters.find(r => r.field === 'nodes.' + field)
    },
    remove (index) {
      this.removeFilter(index)
    },
    update (filter, index) {
      console.log('Updating filter', filter, 'on index', index)
      this.updateFilter({ filter: filter, index: index })
    },
    submitFilters () {
      this.toggleButton(false)
      this.$emit('changedFilters')
    },
    isServiceTypeSelected (type) {
      return this.nodes.service_type.find(t => t === type) || false
    },
    toggleGrouped () {
      this.updateGrouped(this.nodes.grouped)
    },
    changeConditionalFilter (field, operator) {
      const index = this.findIndex(field)
      const filter = {
        field: 'nodes.' + field,
        operator: operator,
        value: this.nodes[field]
      }

      if (filter.value === '') {
        this.remove(index)
      } else {
        this.update(filter, index)
      }
    },
    changeNumericInFilter (field) {
      const index = this.findIndex(field)

      if (!this.nodes[field] || this.nodes[field].length === 0) {
        this.remove(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'IN',
          value: [parseInt(this.nodes[field])]
        }

        this.update(filter, index)
      }
    },
    toggleServiceType (type) {
      const list = this.nodes.service_type.slice()
      const index = list.findIndex(s => s === type)

      // Search for each selected service type from the list and toggle the one we clicked on
      if (index !== -1) {
        list.splice(index, 1)
      } else {
        list.push(type)
      }

      // Set the updated list of service types
      this.$set(this.nodes, 'service_type', list)

      this.updateServiceTypes()
    },
    updateServiceTypes (list) {
      const field = 'service_type'
      const index = this.findIndex(field)

      // Add or remove the service type filter from the list of rules
      if (!this.nodes[field] || this.nodes[field].length === 0) {
        this.remove(index)
      } else {
        const filter = {
          field: 'nodes.' + field,
          operator: 'ALL',
          value: this.nodes[field]
        }

        this.update(filter, index)
      }
    },
    filterPriceRange (range) {
      const index = this.findIndex('price')

      // Remove price if min = 0 and max = slider maxValue value
      if (range[0] === 0 && range[1] === this.sliders.price.maxValue) {
        this.remove(index)
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
        this.remove(index)
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
        this.remove(index)
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