<template>
  <div class="container container-600">
    <div class="pad">
      <h2>{{ title }}</h2>
      <div class="list-add-item" v-if="enabled">
        <input
          id="domain"
          name="domain"
          type="text"
          class="input"
          placeholder="Enter new domain"
          v-model="domain"
          v-validate="'url'"
          :class="{ 'input-error': errors.has('domain') }"
          @keyup.enter="add">

        <button @click.prevent="add" class="button button-success right">Add Domain</button>

        <span v-show="errors.has('domain')" class="input-error-msg">
          {{ errors.first('domain') }}
        </span>
      </div>
      <div v-else class="cannot-edit-message">
        {{ forbiddenMessage }}
      </div>

      <ul>
        <li v-for="(item, index) in list" :key="index" class="list-item">
          <span class="title"><strong>{{ item }}</strong></span>
          <div class="listener-actions">
            <button @click.prevent="remove" class="button button-sm" :disabled="!enabled">Remove</button>
          </div>
        </li>
      </ul>
    </div>
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
      if (this.domain) {
        this.list.push(this.domain)
        this.reset()
        this.update()
      }
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
