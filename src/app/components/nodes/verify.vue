<template>
  <div>
    <top :title="$i18n.t('nodes.VERIFY_NODE')"/>
    <template v-if="!error">
      <div v-if="!loading">
        <div class="alert-msg-centered">
          <div class="icon-alert-circle big-icon"/>
          <h1>{{ $i18n.t('nodes.VERIFICATION_FAILED_TITLE') }}</h1>
          <div v-html="$i18n.t('nodes.VERIFICATION_FAILED', { name: node.friendly_name })"/>
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
  created () {
    this.fetchNode()
  },
  methods: {
    async fetchNode () {
      await nodeAPI.node({
        data: { id: this.$route.params.id },
        success: async response => {
          if (response.data.result) {
            this.node = response.data.result
            this.loading = false
          }
        },
        fail: (e) => {
          console.log(e)
          this.errorItem = 'node'
          this.error = true
        }
      })
    }
  }
}
</script>

<style>

</style>
