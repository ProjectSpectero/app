<template>
  <div v-if="specs">
    <div
      v-if="specs.system.data.CPU.Model || specs.system.data.CPU.Cores"
      class="line">
      <span class="icon-cpu"/> <strong>CPU:</strong>
      <span v-if="specs.system.data.CPU.Model">{{ specs.system.data.CPU.Model }}</span>
      <span v-if="specs.system.data.CPU.Cores">({{ specs.system.data.CPU.Cores }} cores)</span>
    </div>

    <div class="line">
      <span class="icon-activity"/> <strong>Memory:</strong>
      <span v-if="memoryUsed">{{ memoryUsed }}</span>
      <span v-else>-</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      specs: 'daemonAuth/specs'
    }),
    memoryUsed () {
      if (this.specs.system.data.Memory && this.specs.system.data.Memory.Physical.Total && this.specs.system.data.Memory.Physical.Used) {
        const total = this.specs.system.data.Memory.Physical.Total
        const used = this.specs.system.data.Memory.Physical.Used
        const percentage = Math.ceil(used * 100 / total)
        return humanMemory(used) + '/' + humanMemory(total) + ' (' + percentage + '%)'
      }

      return '-'
    }
  }
}

function humanMemory (bytes) {
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

</script>

<style lang="scss" scoped>

</style>
