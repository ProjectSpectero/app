<template>
  <div v-if="item">
    <item-details v-if="!loading" :item="item" :type="$route.params.type"></item-details>
    <loading v-else></loading>
  </div>
</template>

<script>
import loading from '@/shared/components/loading'
import marketAPI from '@/app/api/market.js'
import itemDetails from './details'

export default {
  data () {
    return {
      loading: true,
      item: null
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
          console.log(response.data.result)
          this.loading = false
          this.item = response.data.result
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    }
  },
  components: {
    loading,
    itemDetails
  }
}
</script>
