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
        <input :id="'service-type-' + type" type="checkbox" @click="toggleServiceType(type)">
        {{ type }}
      </label>
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
        service_type: null,
        ip_count: null
      },
      rules: []
    }
  },
  methods: {
    find (field) {
      return this.rules.findIndex(r => r.field === 'nodes.' + field)
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

      this.$emit('changedRules', this.rules)
    },
    changeConditionalFilter (field, operator) {
      const index = this.find(field)
      const filter = {
        field: 'nodes.' + field,
        operator: operator,
        value: this.nodes[field]
      }

      this.updateFilters(filter, index)
    },
    changeInFilter (field) {
      const index = this.find(field)

      if (!this.nodes[field]) {
        this.clearFilter(index)
      } else {
        const index = this.find(field)
        const filter = {
          field: 'nodes.' + field,
          operator: 'IN',
          value: [parseInt(this.nodes[field])]
        }

        this.updateFilters(filter, index)
      }
    },
    toggleServiceType (type) {
      const obj = this.rules.find(r => r.field === 'nodes.service_type')

      if (obj) {
      }
    }
  }
}
</script>
