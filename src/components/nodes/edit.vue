<template>
  <div>
    <top title="Edit Node"></top>
    <div v-if="!loading">
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

      <ips :ips="ips"></ips>
      <services :services="services"></services>
      <orders :orders="orders"></orders>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'
import loading from '@/components/common/loading'
import ips from '@/components/nodes/listIps'
import services from '@/components/nodes/listServices'
import orders from '@/components/nodes/listOrders'

export default {
  metaInfo: {
    title: 'Edit Node'
  },
  data () {
    return {
      loading: true,
      node: null,
      group: null,
      orders: null,
      services: null,
      ips: null
    }
  },
  created () {
    this.fetchNode()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    async fetchNode () {
      await nodeAPI.node({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.node = response.data.result
            this.fetchGroup(this.node.group_id)
            this.fetchExtras('Orders', this.node.id)
            this.fetchExtras('Services', this.node.id)
            this.fetchExtras('Ips', this.node.id)
          } else {
            // this.error404()
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    fetchExtras (type, id) {
      const method = nodeAPI['node' + type]
      const varName = type.toLowerCase()

      method({
        data: {
          id: id
        },
        success: response => {
          if (response.data.result) {
            this[varName] = response.data.result
          }
        },
        fail: (e) => {
          console.log(e)
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
        fail: () => this.error404()
      })
    }
  },
  components: {
    top,
    loading,
    ips,
    services,
    orders
  }
}
</script>
