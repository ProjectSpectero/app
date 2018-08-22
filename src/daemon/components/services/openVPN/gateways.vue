<template>
  <div v-if="allGateways">
    <h5>Redirect Gateway <tooltip id="services.topics.redirectGateway"/></h5>

    <div
      v-for="(option, i) in allGateways"
      :key="i"
      class="form-checkbox">
      <p-input
        :id="`redirectGateway-${option.id}`"
        :checked="list.includes(option.id) ? true : false"
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
  },
  methods: {
    toggle (value, option) {
      if (!value) {
        const i = this.list.indexOf(option.id)

        if (i !== -1) {
          this.list.splice(i, 1)
        }
      } else {
        this.list.push(option.id)
      }

      this.update()
    },
    update () {
      this.$emit('update', this.list)
    }
  }
}
</script>
