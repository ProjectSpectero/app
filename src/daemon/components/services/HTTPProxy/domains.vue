<template>
  <div class="section">
    <h2>{{ title }}</h2>
    <div class="add" v-if="enabled">
      <div class="input-float">
        <input
          id="domain"
          name="domain"
          type="text"
          class="input"
          placeholder="Enter new domain to add"
          v-model="domain"
          v-validate="'required|url'"
          :class="{ 'input-error': errors.has('domain') }"
          @keyup.enter="add"
          data-vv-as="domain">
        <div v-show="errors.has('domain')" class="input-error-msg">
          {{ errors.first('domain') }}
        </div>
      </div>

      <button @click.prevent="add" class="button-md button-success">
        {{ $i18n.t('services.ADD_DOMAIN') }}
      </button>
    </div>
    <div v-else class="cannot-edit-message">
      {{ forbiddenMessage }}
    </div>

    <ul class="ip-list">
      <li v-for="(item, index) in list" :key="index" class="list-item">
        <div class="ip-label">
          <strong>{{ item }}</strong>
        </div>
        <button @click.prevent="remove" class="button-sm button-bordered button-danger" :disabled="!enabled">
          {{ $i18n.t('misc.REMOVE') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    forbiddenMessageKey: String,
    domains: Array,
    proxy: String,
    enabled: Boolean
  },
  data () {
    return {
      domain: null,
      list: []
    }
  },
  created () {
    this.list = JSON.parse(JSON.stringify(this.domains)) || []
  },
  computed: {
    forbiddenMessage () {
      return this.$i18n.t(this.forbiddenMessageKey)
    }
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
