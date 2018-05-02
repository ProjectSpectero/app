<template>
  <div>
    <top title="Edit Service">
      <button @click="askBeforeExiting" class="button">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>
    <p>{{ $i18n.t('misc.AVAILABLE_SOON') }}</p>
  </div>
</template>

<script>
import top from '@/shared/components/top'

export default {
  methods: {
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, action: 'services' } })
      }
    }
  },
  components: {
    top
  }
}
</script>
