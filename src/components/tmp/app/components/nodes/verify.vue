<template>
  <div>
    <top :title="$i18n.t('nodes.VERIFY_NODE')"/>
    <template v-if="!error">
      <div v-if="!loading">
        <div
          v-if="verifyError"
          class="alert-msg-centered">
          <div class="icon-alert-circle big-icon"/>
          <h1>{{ $i18n.t('nodes.VERIFICATION_FAILED_TITLE') }}</h1>
          <div v-html="$i18n.t('nodes.VERIFICATION_FAILED')"/>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'

export default {
  components: {
    loading,
    error,
    top
  },
  data () {
    return {
      verifyError: false
    }
  },
  created () {
    this.verifyError = false
    this.fetchNode()
  },
  methods: {
    async fetchNode () {
      await nodeAPI.node({
        data: { id: this.$route.params.id },
        success: async response => {
          let node = response.data.result

          if (node) {
            this.verifyNode(node)
          } else {
            this.loading = false
            this.verifyError = true
          }
        },
        fail: (e) => {
          console.log(e)
          this.errorItem = 'node'
          this.error = true
        }
      })
    },
    verifyNode (node) {
      nodeAPI.verify({
        data: { id: node.id },
        success: async response => {
          this.loading = false
          this.$toasted.success(this.$i18n.t('nodes.NODE_VERIFY_SUCCESS', { node: node.friendly_name }))
          this.$router.push({ name: 'nodes' })
        },
        fail: (error) => {
          this.loading = false
          this.$toasted.error(this.errorAPI(error, 'nodes'))
          this.$router.push({ name: 'nodes' })
        }
      })
    }
  }
}
</script>

<style>

</style>
