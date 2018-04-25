<template>
  <div>
    <top title="Order Resources">
      <h4>Order #{{ $route.params.id }}</h4>
    </top>
    <div v-if="resources">
      <div v-for="item in resources" :key="item.id">
        <h4>Item {{ item.id }} ({{ item.resource.type }})</h4>

        <resources-list :items="parseReferences(item.resource.reference)"></resources-list>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import resourcesList from '@/app/components/nodes/resourcesList'
import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      resources: null
    }
  },
  created () {
    this.fetchResources()
  },
  methods: {
    async fetchResources () {
      await orderAPI.resources({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.resources = response.data.result.resources
          console.log(this.resources)
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    parseReferences (reference) {
      let data = []
      reference.forEach(r => {
        const parsed = JSON.parse(r.resource)

        data.push({
          accessReference: parsed.accessReference ? parsed.accessReference.join(',') : '',
          accessConfig: parsed.accessConfig,
          accessCredentials: parsed.accessCredentials
        })
      })

      console.log('data', data)

      return data
    }
  },
  components: {
    top,
    loading,
    resourcesList
  }
}
</script>

<style>

</style>
