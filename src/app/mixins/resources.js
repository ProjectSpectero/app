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
          this.buildResourceTree(response.data.result.items)

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
    buildResourceTree (items) {
      if (items.length) {
        let tree = []

        items.forEach(item => {
          // If we run into a response without references, just silently continue
          if (item.resource.reference) {
            let references = []

            // Node group references work in a different way:
            // they hold an extra level (array) because a group is made of
            // multiple nodes, so we have to iterate on that too
            references = (item.resource.type === 'NODE_GROUP')
              ? this.parseGroupReferences(item.resource.reference)
              : this.parseNodeReferences(item.resource.reference)

            tree.push({
              id: item.resource.id,
              type: item.resource.type,
              references: references
            })
          }
        })

        // Shouldn't really happen, but if we run into a response without resources,
        // parsing must be stopped and "no results" should be displayed
        if (tree.length > 0) {
          this.resources = tree

          tree.forEach(item => {
            this.buildResource(item)
          })

          this.selectResource(tree[0])
        } else {
          // Changing resources from null to empty array = "no resources found"
          this.resources = []
        }
      } else {
        this.resources = []
      }
    },
    parseNodeReferences (reference) {
      let data = []

      reference.forEach(ref => {
        const connector = ref.connector || null

        if (connector) {
          const baseData = {
            type: ref.type
          }

          data.push({ ...baseData, ...this.buildConnector(connector) })
        }
      })

      return data
    },
    parseGroupReferences (reference) {
      let data = []

      reference.forEach(ref => {
        ref.services.forEach(service => {
          const connector = service.connector || null

          if (connector) {
            const baseData = {
              nodeId: ref.from,
              type: service.type
            }

            data.push({ ...baseData, ...this.buildConnector(connector) })
          }
        })
      })

      return data
    },
    buildConnector (connector) {
      return {
        accessReference: connector.accessReference ? connector.accessReference.join('\n') : '',
        accessConfig: connector.accessConfig,
        accessCredentials: (connector.accessCredentials && connector.accessCredentials === 'SPECTERO_USERNAME_PASSWORD')
          ? this.$t('orders.USE_ACCESSOR')
          : connector.accessCredentials
      }
    },
    buildResource (item) {
      let sortedReferences = {}
      let selectedType = (this.types && this.types[0]) ? this.types[0] : null

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
          this.$toasted.error(this.$t('orders.UNABLE_TO_CHECK_ACCESSOR'))
          console.log(e)
        }
      })
    },
    selectResource (item) {
      if (this.types && this.types[0]) {
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
