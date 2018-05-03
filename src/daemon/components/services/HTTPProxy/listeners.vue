<template>
  <div class="section">
    <h2>{{ $i18n.t('misc.LISTENERS') }}</h2>

    <div class="add">
      <div class="input-float">
        <input
          id="ip"
          name="ip"
          type="text"
          class="input"
          placeholder="IP Address"
          v-model="ip"
          v-validate="rules.ip"
          :class="{ 'input-error': errors.has('ip') }"
          @keyup.enter="add">
        <div v-show="errors.has('ip')" class="input-error-msg">
          {{ errors.first('ip') }}
        </div>
      </div>

      <div class="input-float">
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
        <div v-show="errors.has('port')" class="input-error-msg">
          {{ errors.first('port') }}
        </div>
      </div>

      <button @click.prevent="add" class="button button-md button-success">
        {{ $i18n.t('services.ADD_LISTENER') }}
      </button>
    </div>

    <ul v-if="list.length > 0" class="ip-list">
      <li v-for="(listener, index) in list" :key="index" class="list-item">
        <div class="ip-label">
          <strong>{{ listener.item1 }}</strong>:{{ listener.item2 }}
        </div>
        <button @click.prevent="remove(index)" class="button button-sm button-bordered button-danger">
          {{ $i18n.t('misc.REMOVE') }}
        </button>
      </li>
    </ul>
    <span v-else>No listeners added yet.</span>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $pad;
  padding-bottom: $pad;
  border-bottom: 1px solid $color-border;
}
.input-float {
  flex: 1;
  margin-right: 12px;
}
.ip-list {
  list-style: none;

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
</style>
