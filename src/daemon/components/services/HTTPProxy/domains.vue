<template>
  <div class="section">
    <h2>{{ title }}</h2>
    <div
      v-if="enabled"
      class="add">
      <div class="input-float">
        <input
          v-validate="'required|url'"
          id="domain"
          v-model="domain"
          :class="{ 'input-error': errors.has('domain') }"
          name="domain"
          type="text"
          class="input"
          placeholder="Enter new domain to add"
          data-vv-as="domain"
          @keyup.enter="add">
        <div
          v-show="errors.has('domain')"
          class="input-error-msg"
          v-html="errors.first('domain')"/>
      </div>

      <button
        class="button is-medium is-success"
        @click.prevent="add">
        {{ $t('services.ADD_DOMAIN') }}
      </button>
    </div>
    <div
      v-else
      class="cannot-edit-message">
      {{ forbiddenMessage }}
    </div>

    <div
      v-if="list.length > 0"
      class="ip-list">
      <ul>
        <li
          v-for="(item, index) in list"
          :key="index"
          class="list-item">
          <div class="ip-label">
            <strong>{{ item }}</strong>
          </div>
          <button
            :disabled="!enabled"
            class="is-small is-outlined button is-danger"
            @click.prevent="remove">
            {{ $t('misc.REMOVE') }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Domains'
    },
    forbiddenMessageKey: {
      type: String,
      required: true
    },
    domains: {
      type: Array,
      required: true
    },
    proxy: {
      type: String,
      required: false,
      default: ''
    },
    enabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      domain: null,
      list: []
    }
  },
  computed: {
    forbiddenMessage () {
      return this.$t(this.forbiddenMessageKey)
    }
  },
  created () {
    this.list = this.domains
  },
  methods: {
    remove (index) {
      this.list.splice(index, 1)
      this.update()
    },
    add () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.list.push(this.domain)
          this.reset()
          this.update()
        }
      })
    },
    update () {
      this.$emit('update', this.list)
    },
    reset () {
      this.domain = null
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
    max-height: 480px;
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
