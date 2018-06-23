import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      accessor: null,
      resources: null,
      errorItem: 'resources',
      errorCode: 400
    }
  },
  computed: {
    orderId () {
      return this.$route.params.id ? parseInt(this.$route.params.id) : parseInt(this.order.id)
    }
  },
  methods: {
    async fetchResources () {
      await orderAPI.resources({
        data: { id: this.orderId },
        success: response => {
          this.accessor = response.data.result.accessor ? this.parseAccessor(response.data.result.accessor) : ''
          this.buildResourceTree(response.data.result.resources)
          this.error = false
        },
        fail: (e) => {
          console.log(e)
          this.error = true
        }
      })
    },
    parseAccessor (accessor) {
      const data = accessor.split(':')

      if (data.length === 2) {
        return {
          username: data[0],
          password: data[1]
        }
      }

      return data
    },
    buildResourceTree (data) {
      let tree = []

      data.forEach(item => {
        let references = this.parseReferences(item.resource.reference) || []

        tree.push({
          id: item.resource.id,
          type: item.resource.type,
          references: references
        })
      })

      this.resources = tree

      tree.forEach(item => {
        this.buildResource(item)
      })

      this.selectResource(tree[0])
    },
    parseReferences (reference) {
      let data = []

      reference.forEach(ref => {
        const r = ref.resource

        data.push({
          type: ref.type,
          accessReference: r.accessReference ? r.accessReference.join('\n') : '',
          accessConfig: r.accessConfig,
          accessCredentials: (r.accessCredentials === 'SPECTERO_USERNAME_PASSWORD') ? this.$i18n.t('orders.USE_ACCESSOR') : r.accessCredentials
        })
      })

      return data
    },
    buildResource (item) {
      let sortedReferences = {}
      let selectedType = this.types[0]

      item.references.forEach(r => {
        if (sortedReferences[r.type] === undefined) {
          sortedReferences[r.type] = []
        }

        sortedReferences[r.type].push(r)

        if (!selectedType) {
          selectedType = r.type
        }
      })

      // Update references with list sorted by type (OpenVPN, ...)
      this.$set(item, 'references', sortedReferences)
    },
    async fetchAccessor () {
      this.accessorCheckPending = true

      await orderAPI.resources({
        data: {
          id: this.orderId
        },
        success: response => {
          this.accessorCheckPending = false
          this.accessor = this.parseAccessor(response.data.result.accessor)
        },
        fail: (e) => {
          this.$toasted.error(this.$i18n.t('orders.UNABLE_TO_CHECK_ACCESSOR'))
          console.log(e)
        }
      })
    },
    selectResource (item) {
      if (this.types[0]) {
        this.selectedResource = item
        this.selectReference(this.types[0])
      }
    },
    selectReference (type) {
      this.selectedType = type
      this.selectedReferences = this.selectedResource.references[type] || []
    }
  }
}
