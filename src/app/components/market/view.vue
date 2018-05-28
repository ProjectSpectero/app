<template>
  <div>
    <template v-if="!error">
      <div v-if="item">
        <item-details v-if="!loading" :item="item" :type="$route.params.type"></item-details>
        <loading v-else></loading>
      </div>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import marketAPI from '@/app/api/market'
import itemDetails from './details'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'

export default {
  data () {
    return {
      item: null,
      errorItem: 'node'
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      await marketAPI.fetch({
        data: {
          id: this.$route.params.id,
          type: this.$route.params.type
        },
        success: response => {
          response.data.result.type = (this.$route.params.type === 'group') ? 'NODE_GROUP' : 'NODE'
          this.item = response.data.result
          this.loading = false
          this.error = false
        },
        fail: (e) => {
          console.log(e)
          this.error = true
        }
      })
    }
  },
  components: {
    loading,
    error,
    itemDetails
  }
}
</script>
