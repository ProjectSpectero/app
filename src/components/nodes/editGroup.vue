<template>
  <div>
    <top title="Edit Group"></top>
    <div v-if="!loading">
      {{ group.id }}
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'
import loading from '@/components/common/loading'

export default {
  metaInfo: {
    title: 'Edit Node Group'
  },
  data () {
    return {
      loading: true,
      group: null
    }
  },
  created () {
    this.fetchGroup(this.$route.params.id)
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
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
    loading
  }
}
</script>
