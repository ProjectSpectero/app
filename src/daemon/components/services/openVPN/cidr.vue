<template>
  <div>
    <h5>Pushed Networks</h5>

    <div class="add">
      <div class="input-float">
        <input
          id="network"
          v-model="network"
          name="network"
          type="text"
          placeholder="Network"
          class="input">
        <div
          v-show="errors.has('network')"
          class="input-error-msg"
          v-html="errors.first('network')"/>
      </div>
      <button
        class="button is-medium is-success"
        @click.prevent="add(network)">
        Add Network
      </button>
    </div>

    <div
      v-show="networkError"
      class="input-error-msg">
      {{ $t('daemon.INVALID_NETWORK') }}
    </div>

    <div
      v-if="list"
      class="ip-list">
      <ul>
        <li
          v-for="(item, i) in list"
          :key="i"
          class="list-item">
          <div class="ip-label">
            <strong>{{ item }}</strong>
          </div>
          <button
            class="button is-small"
            @click.prevent="remove(i)">
            <span class="icon-x"/>
          </button>
        </li>
      </ul>
    </div>
    <p
      v-else
      class="none">No networks added yet.</p>
  </div>
</template>

<script>
export default {
  props: {
    pushedNetworks: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      network: null,
      networkError: false,
      list: []
    }
  },
  created () {
    this.list = this.pushedNetworks
  },
  methods: {
    remove (index) {
      this.list.splice(index, 1)
      this.update()
    },
    add (network) {
      if (this.isValidCIDR(network)) {
        this.list.push(network)

        this.update()
        this.reset()
      } else {
        this.networkError = true
      }
    },
    update () {
      this.$emit('update', this.list)
    },
    reset () {
      this.$validator.reset()
      this.networkError = false
      this.network = null
    },
    isValidCIDR (network) {
      const cidrRegex = require('cidr-regex')
      return cidrRegex({ exact: true }).test(network)
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.input-float {
  flex: 1;
  margin-right: 12px;
}
.ip-list {
  margin-top: $pad;

  ul {
    max-height: 490px;
    overflow-y: auto;
    list-style: none;
  }
  li {
    padding: 8px 8px 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:nth-child(2n+1) {
      background: $color-smoke;
    }
  }
}
.none {
  margin-top: $pad;
}
</style>
