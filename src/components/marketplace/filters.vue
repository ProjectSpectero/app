<template>
  <form class="filters" @submit.prevent.stop="">
    <div>
      <label for="">Market model</label>
      <div>
        <label>
          <input type="radio" name="market-model" value="LISTED_SHARED" v-model="nodes.market_model" @change="changeConditionalFilter('market_model', '=')">
          Listed (Shared)
        </label>
      </div>

      <div>
        <label>
          <input type="radio" name="market-model" value="LISTED_DEDICATED" v-model="nodes.market_model" @change="changeConditionalFilter('market_model', '=')">
          Listed (Dedicated)
        </label>
      </div>
    </div>
    <div>
      <label>
        <input type="number" v-model="nodes.asn" placeholder="ASN">
        ASN
      </label>
      <button @click="changeInFilter('asn')">Apply</button>
    </div>
    <div>
      <label :for="'service-type-' + type" v-for="type in serviceTypes" :key="type">
        <input :id="'service-type-' + type" type="checkbox" @change="toggleServiceType(type)">
        {{ type }}
      </label>
    </div>
    <div>
      <button @click.prevent.stop="filterPriceRange(50,80)">Filter price between 50 and 80</button>
    </div>
    <div>
      <label>
        <input type="number" v-model="nodes.ip_count" placeholder="Minimum number of IP addresses">
        Minimum number of IP addresses
      </label>
      <button @click="filterIPCount">Apply</button>
    </div>
    <div>
      <label>
        <input type="text" v-model="nodes.cc" placeholder="Country code">
        Country code
      </label>
      <button @click="filterCountryCode">Apply</button>
    </div>
    <div>
      <label>
        <input type="text" v-model="nodes.city" placeholder="City">
        City
      </label>
      <button @click="changeConditionalFilter('city', '=')">Apply</button>
    </div>
  </form>
</template>

<script>
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
      rules: []
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

      this.updateFilters(filter, index)
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
    filterPriceRange (min, max) {
      const index = this.findIndex('price')

      const filter = {
        field: 'nodes.price',
        operator: 'RANGE',
        value: {
          start: min,
          end: max
        }
      }

      this.updateFilters(filter, index)
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

      this.updateFilters(filter, index)
    }
  }
}
</script>
