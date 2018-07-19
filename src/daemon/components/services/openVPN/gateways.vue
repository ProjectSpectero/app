<template>
  <div v-if="allGateways">
    <h5>Redirect Gateway <tooltip id="services.topics.redirectGateway"/></h5>

    <div
      v-for="(option, i) in allGateways"
      :key="i"
      class="form-checkbox">
      list[i]: {{ list[i] }}
      list: {{ list }}
      list[option.id] {{ list[option.id] }}
      <p-input
        :id="`redirectGateway-${option.id}`"
        :value="option.id"
        v-model="list[option.id]"
        type="checkbox"
        class="p-default p-curve"
        @change="toggle($event, option)">
        {{ $i18n.t(`cloud.gateway.${option.label}`) }}
      </p-input>
    </div>
  </div>
</template>

<script>
import tooltip from '@/shared/components/tooltip'
import all from '@/shared/helpers/gateway'

export default {
  components: {
    tooltip
  },
  props: {
    currentGateways: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      list: [],
      allGateways: all
    }
  },
  created () {
    this.list = this.currentGateways
    console.log('set list to currentGateways values', this.list)
  },
  methods: {
    toggle (value, option) {
      if (!value) {
        const i = this.list.indexOf(option.id)

        if (i !== -1) {
          console.log('Toggled to false and found this item (' + option.id + '), removing it')
          this.list.splice(i, 1)
        }
      } else {
        console.log('Toggled to true and item is new (' + option.id + '), adding it')
        this.list.push(option.id)
      }

      this.update()
      console.log('updated gateways list', this.list)
    },
    update () {
      this.$emit('update', this.list)
    }
  }
}
</script>
