<template>
  <div class="section">
    <h2>{{ $i18n.t('misc.LISTENERS') }}</h2>

    <div class="add">
      <div class="input-float">
        <input
          v-validate="rules.ip"
          id="ip"
          v-model="ip"
          :class="{ 'input-error': errors.has('ip') }"
          name="ip"
          type="text"
          class="input"
          placeholder="IP Address"
          data-vv-as="IP address"
          @keyup.enter="add">
        <div
          v-show="errors.has('ip')"
          class="input-error-msg">
          {{ errors.first('ip') }}
        </div>
      </div>

      <div class="input-float">
        <input
          v-validate="rules.port"
          id="port"
          v-model="port"
          :class="{ 'input-error': errors.has('port') }"
          name="port"
          type="number"
          class="input"
          placeholder="Port"
          data-vv-as="port"
          @keyup.enter="add">
        <div
          v-show="errors.has('port')"
          class="input-error-msg">
          {{ errors.first('port') }}
        </div>
      </div>

      <button
        class="button-md button-success"
        @click.prevent="add">
        {{ $i18n.t('services.ADD_LISTENER') }}
      </button>
    </div>
    <div
      v-if="list.length > 0"
      class="ip-list">
      <ul>
        <li
          v-for="(listener, index) in list"
          :key="index"
          class="list-item">
          <div class="ip-label">
            <strong>{{ listener.item1 }}</strong>:{{ listener.item2 }}
          </div>
          <button
            class="button-sm button-icon"
            @click.prevent="remove(index)">
            <span class="icon-x"/>
          </button>
        </li>
      </ul>
    </div>
    <span v-else>No listeners added yet.</span>
  </div>
</template>

<script>
export default {
  props: {
    listeners: {
      type: Array,
      required: true
    },
    ip: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      list: [],
      port: null,
      rules: {
        port: {
          required: true,
          min_value: 1024,
          max_value: 65535
        },
        ip: {
          required: true,
          regex: /^(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
        }
      }
    }
  },
  created () {
    this.list = this.listeners.map(a => ({...a}))
  },
  methods: {
    remove (index) {
      this.list.splice(index, 1)
      this.update()
    },
    add () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.list.push({
            item1: this.ip,
            item2: this.port
          })

          this.update()
          this.reset()
        }
      })
    },
    update () {
      this.$emit('update', this.list)
    },
    reset () {
      this.$validator.reset()
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
}
.input-float {
  flex: 1;
  margin-right: 12px;
}
.ip-list {
  margin-top: $pad;
  padding-top: $pad;
  border-top: 1px solid $color-border;

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
</style>
