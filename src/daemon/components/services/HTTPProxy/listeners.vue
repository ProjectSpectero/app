<template>
  <div class="container container-600">
    <div class="pad">
      <h2>Listeners</h2>

      <div class="add">
        <div class="inputs">
          <input
            id="ip"
            name="ip"
            type="text"
            class="input"
            placeholder="IP address"
            v-model="ip"
            v-validate="rules.ip"
            :class="{ 'input-error': errors.has('ip') }"
            @keyup.enter="add">

          <input
            id="port"
            name="port"
            type="number"
            class="input"
            placeholder="Port"
            v-model="port"
            v-validate="rules.port"
            :class="{ 'input-error': errors.has('port') }"
            @keyup.enter="add">
        </div>

        <button @click.prevent="add" class="button button-success right">Add Listener</button>

        <span v-show="errors.has('ip')" class="input-error-msg">
          {{ errors.first('ip') }}
        </span>

        <span v-show="errors.has('port')" class="input-error-msg">
          {{ errors.first('port') }}
        </span>
      </div>

      <ul>
        <li v-for="(listener, index) in list" :key="index" class="list-item">
          <span class="title">
            <strong>{{ listener.item1 }}</strong>:{{ listener.item2 }}
          </span>
          <div class="listener-actions">
            <button @click.prevent="remove(index)" class="button button-sm">
              Remove
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listeners: Array
  },
  data () {
    return {
      list: [],
      ip: null,
      port: null,
      rules: {
        port: {
          min_value: 1024,
          max_value: 65535
        },
        ip: {
          regex: /^(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
        }
      }
    }
  },
  created () {
    this.list = JSON.parse(JSON.stringify(this.listeners))
  },
  methods: {
    remove (index) {
      this.list.splice(index, 1)
      this.update()
    },
    add () {
      if (this.ip && this.port) {
        this.list.push({
          item1: this.ip,
          item2: this.port
        })

        this.reset()
        this.update()
      }
    },
    update () {
      this.$emit('update', this.list)
    },
    reset () {
      this.ip = null
      this.port = null
    }
  }
}
</script>

<style lang="scss" scoped>
  .add {
    .inputs {
      display: flex;
      justify-content: space-between;

      > input {
        width: calc(1/2 * 100% - (1 - 1/2) * 20px)
      }
    }
  }
</style>
