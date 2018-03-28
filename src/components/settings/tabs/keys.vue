<template>
  <div>
    <h2>Node Key</h2>

    <div class="col-container col-2">
      <div class="col-half">
        <div class="form-input">
          <div class="label"><label for="nodeKeyPlaceholder"><strong>Current Node Key</strong></label></div>
          <textarea
            type="email"
            :value="nodeKey"
            name="nodeKeyPlaceholder"
            id="nodeKeyPlaceholder"
            placeholder="Node Key"
            class="input max-width"
            disabled>
          </textarea>
        </div>
        <br>
        <h3>Generate New Key</h3>
        <p>Use the button below to generate a new node key. Your old key will become invalid if you do this.</p><br>
        <button class="button button-warning" @click.prevent.stop="regenerateNodeKey" :class="{ 'button-loading': formLoading }" :disabled="formLoading">Regenerate Node Key</button>
      </div>
    </div>
  </div>
</template>

<script>
import userAPI from '@/api/user.js'

export default {
  props: {
    user: Object
  },
  metaInfo: {
    title: 'Node Key'
  },
  data () {
    return {
      nodeKey: null,
      formLoading: false
    }
  },
  methods: {
    regenerateNodeKey () {
      this.formLoading = true

      userAPI.regenerateNodeKey({
        success: response => {
          this.nodeKey = response.data.result.node_key
          this.$toasted.success('New node key has been generated.')
          this.formLoading = false
        },
        fail: error => {
          console.error(`Node key generate error`, error)
          this.$toasted.error('Unable to generate new node key.')
          this.formLoading = false
        }
      })
    }
  },
  created () {
    this.form = this.user.slice()
    this.nodeKey = this.form['node_key']
  }
}
</script>

<style lang="scss" scoped>

</style>
