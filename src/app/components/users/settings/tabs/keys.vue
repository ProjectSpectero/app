<template>
  <div>
    <div class="grid-container">
      <div class="grid-title">
        <h2>Node Key</h2>
      </div>
      <div class="col-6">
        <div class="node-key">
          <div class="form-input">
            <div class="label"><label for="nodeKeyPlaceholder"><strong>Current Node Key</strong></label></div>
            <textarea
              id="nodeKeyPlaceholder"
              :value="nodeKey"
              type="email"
              name="nodeKeyPlaceholder"
              placeholder="Node Key"
              class="input max-width"
              readonly/>
          </div>
          <copy-to-clipboard
            :field="nodeKey"
            button-class="button is-small"/>
        </div>
        <h3>Generate New Key</h3>
        <p>Use the button below to generate a new node key. Your old key will become invalid if you do this.</p><br>
        <button
          :class="{ 'is-loading': formLoading }"
          :disabled="formLoading"
          class="button is-warning"
          @click.prevent.stop="regenerateNodeKey">Regenerate Node Key</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import userAPI from '@/app/api/user'
import copyToClipboard from '@/shared/components/copyToClipboard'

export default {
  components: {
    copyToClipboard
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
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.nodeKey = this.form['node_key']
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    regenerateNodeKey () {
      this.formLoading = true

      userAPI.regenerateNodeKey({
        success: response => {
          this.syncCurrentUser()
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
  }
}
</script>

<style lang="scss" scoped>
.node-key {
  margin-bottom: $pad;
}
</style>
