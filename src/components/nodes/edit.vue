<template>
  <div v-if="!loading">
    <top title="Edit Node"></top>
    <div v-if="!error">
      <h1>
        Node #{{ node.id }}
        <span v-if="node.friendly_name">({{ node.friendly_name }})</span>
      </h1>
      <h3>
        Belongs to group #{{ group.id }}
        <span v-if="group.friendly_name">({{ group.friendly_name }})</span>
      </h3>

      <ul>
        <li>Market model: {{ node.market_model }}</li>
        <li>Status: {{ node.status }}</li>
        <li>price: {{ node.price }}</li>
      </ul>
    </div>
    <div v-else>
      {{ error }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'Edit Node'
  },
  data () {
    return {
      loading: true,
      error: null,
      node: null,
      group: null
    }
  },
  created () {
    this.fetchOrder()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    async fetchOrder () {
      await nodeAPI.node({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.node = response.data.result
            this.fetchGroup(this.node.group_id)
          } else {
            this.error404()
          }
        },
        fail: error => {
          this.error = this.errorAPI(error, 'errors')
          this.loading = false
        }
      })
    },
    async fetchGroup (groupId) {
      await nodeAPI.group({
        data: {
          id: groupId
        },
        success: response => {
          if (response.data.result) {
            this.group = response.data.result
            this.loading = false
          } else {
            this.error404()
          }
        },
        fail: error => {
          this.error = this.errorAPI(error, 'errors')
          this.loading = false
        }
      })
    }
  }
}
</script>

<style>

</style>
