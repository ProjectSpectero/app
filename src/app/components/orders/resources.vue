<template>
  <div>
    <template v-if="!error">
      <div v-if="resources">
        <top :title="'Order '+ orderId +' Resources'">
          <router-link :to="{ name: 'order', params: { id: orderId } }" class="button">
            {{ $i18n.t('orders.BACK_TO_ORDER') }}
          </router-link>
        </top>
        <div v-if="resources && resources.length">
          <div class="container">
            <div class="col-12 content-split">
              <div class="split-list nodes-sidebar">
                <div v-for="(item, index) in resources" :key="index" class="node-group" :class="{ active: selectedResource === item }" @click="selectResource(item)">
                  <div class="group-name">
                    {{ $i18n.t('misc.ITEM') }} {{ item.id }}
                  </div>
                  <div class="count">
                    {{ item.type === 'NODE_GROUP' ? $i18n.t('misc.NODE_GROUP') : $i18n.t('misc.NODE') }}
                  </div>
                </div>
              </div>
              <div class="split-details">
                <div v-if="accessor" class="accessor">
                  <div class="credentials">
                    <div class="label">
                      <label>{{ $i18n.t('orders.ACCESSOR_DETAILS') }}</label>
                    </div>

                    <p>{{ $i18n.t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
                    <p>{{ $i18n.t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>

                    <p v-if="accessorCheckPending" class="changeWarning">
                      {{ $i18n.t('orders.ACCESSOR_DETAILS_TEXT') }}
                    </p>
                  </div>
                  <button @click.stop="showRegenerateAccessorModal(orderId)" class="button-warning">{{ $i18n.t('orders.REGENERATE_ACCESSOR') }}</button>
                </div>

                <ul class="references tabs">
                  <li v-for="t in types" :key="t" @click="selectReference(t)" class="reference" :class="{ active: selectedType === t }">
                    <span>{{ t }}</span>
                  </li>
                </ul>

                <div class="section padded details">
                  <resource-details
                    :id="selectedResource.id"
                    :type="selectedResource.type"
                    :selectedReferences="selectedReferences"
                    :selectedType="selectedType"></resource-details>
                </div>
              </div>
            </div>
          </div>
        </div>
        <loading v-else></loading>
        <modal name="regenerateAccessorModal" :height="'auto'">
          <regenerateAccessor :orderId="orderId" @fetchAccessor="fetchAccessor" />
        </modal>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'
import resourceDetails from './resourceDetails'
import orderAPI from '@/app/api/order'
import regenerateAccessor from './regenerateAccessor'

export default {
  data () {
    return {
      accessor: null,
      resources: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: ['HTTPProxy', 'OpenVPN', 'ShadowSOCKS', 'SSHTunnel'],
      accessorCheckPending: false,
      errorItem: 'resources',
      errorCode: 400
    }
  },
  metaInfo () {
    return {
      title: 'Order ' + this.orderId + ' Resources'
    }
  },
  computed: {
    orderId () {
      return parseInt(this.$route.params.id)
    }
  },
  created () {
    this.fetchOrder()
  },
  methods: {
    async fetchOrder () {
      await orderAPI.order({
        data: { id: this.orderId },
        success: async response => {
          if (response.data.result && response.data.result.status === 'ACTIVE') {
            await this.fetchResources()
          } else {
            this.error = true
          }
        },
        fail: (e) => {
          console.log(e)
          this.error = true
        }
      })
    },
    async fetchResources () {
      await orderAPI.resources({
        data: { id: this.orderId },
        success: response => {
          this.accessor = response.data.result.accessor ? this.parseAccessor(response.data.result.accessor) : ''
          this.buildResourceTree(response.data.result.resources)
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
        tree.push({
          id: item.resource.id,
          type: item.resource.type,
          references: this.parseReferences(item.resource.reference)
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
      reference.forEach(r => {
        const parsed = JSON.parse(r.resource)
        data.push({
          type: r.type,
          accessReference: parsed.accessReference ? parsed.accessReference.join('\n') : '',
          accessConfig: parsed.accessConfig,
          accessCredentials: (parsed.accessCredentials === 'SPECTERO_USERNAME_PASSWORD') ? this.$i18n.t('orders.USE_ACCESSOR') : parsed.accessCredentials
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
    selectResource (item) {
      this.selectedResource = item
      this.selectReference(this.types[0])
    },
    selectReference (type) {
      this.selectedType = type
      this.selectedReferences = this.selectedResource.references[type]
    },
    showRegenerateAccessorModal (orderId) {
      this.$modal.show('regenerateAccessorModal', {
        orderId: orderId
      })
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
    }
  },
  components: {
    top,
    loading,
    error,
    resourceDetails,
    regenerateAccessor
  }
}
</script>

<style lang="scss" scoped>
.accessor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $pad;
  padding: $pad;
  background: $white;
  border-radius: 4px;
  border: 1px solid $color-border;

  .credentials {
    flex: 1;
  }
  .changeWarning {
    margin-top: 10px;
    color: $color-warning;
    font-weight: $font-bold;
  }
}
.details {
  margin-top: 20px;
}
</style>
