<template>
  <form class="filters" @submit.prevent.stop="">
    <div>
      <label for="">Market model</label>
      <div>
        <label>
          <input type="radio" name="market-model" value="LISTED_SHARED" v-model="nodes.market_model" @change="changeFilter('market_model', '=')">
          Listed (Shared)
        </label>
      </div>

      <div>
        <label>
          <input type="radio" name="market-model" value="LISTED_DEDICATED" v-model="nodes.market_model" @change="changeFilter('market_model', '=')">
          Listed (Dedicated)
        </label>
      </div>
    </div>
    <div>
      <label>
        <input type="text" v-model="nodes.asn" @keyup="changeFilter('asn', 'IN')" placeholder="ASN">
        ASN
      </label>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
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
    changeFilter (field, operator) {
      // Update pre-filled filter with the new value and operator
      // or create a new instance of it
      let index = this.rules.findIndex(r => r.field === 'nodes.' + field)
      const filter = {
        field: 'nodes.' + field,
        operator: operator,
        value: (operator !== 'IN') ? this.nodes[field] : [this.nodes[field]]
      }

      if (index !== -1) {
        this.rules[index] = filter
      } else {
        this.rules.push(filter)
      }

      this.$emit('changedRules', this.rules)
    }
  }
}
</script>
