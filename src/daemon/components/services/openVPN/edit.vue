<template>
  <div>
    <top title="OpenVPN Configuration">
      <button
        class="button"
        @click="askBeforeExiting">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>
    <div class="container">
      <div class="col-12">
        <div class="section padded">
          <p>{{ $i18n.t('misc.AVAILABLE_SOON') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'OpenVPN Configuration'
  },
  methods: {
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, action: 'services' } })
      }
    }
  }
}
</script>
