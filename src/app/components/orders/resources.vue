<template>
  <div>
    <template v-if="!error">
      <div v-if="resources">
        <top :title="'Order '+ orderId +' Resources'">
          <router-link
            :to="{ name: 'order', params: { id: orderId } }"
            class="button">
            {{ $i18n.t('orders.BACK_TO_ORDER') }}
          </router-link>
        </top>
        <div v-if="resources && resources.length">
          <div class="container">
            <div class="col-12 content-split">
              <div class="split-list nodes-sidebar">
                <div
                  v-for="(item, index) in resources"
                  :key="index"
                  :class="{ active: selectedResource === item }"
                  class="node-group"
                  @click="selectResource(item)">

                  <div class="group-name">
                    {{ $i18n.t('misc.ITEM') }} {{ item.id }}
                  </div>
                  <div class="count">
                    {{ item.type === 'NODE_GROUP' ? $i18n.t('misc.NODE_GROUP') : $i18n.t('misc.NODE') }}
                  </div>
                </div>
              </div>
              <div class="split-details">
                <div
                  v-if="accessor"
                  class="accessor">
                  <div class="credentials">
                    <div class="label">
                      <label>{{ $i18n.t('orders.ACCESSOR_DETAILS') }}</label>
                    </div>

                    <p>{{ $i18n.t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
                    <p>{{ $i18n.t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>

                    <p
                      v-if="accessorCheckPending"
                      class="changeWarning">
                      {{ $i18n.t('orders.ACCESSOR_DETAILS_TEXT') }}
                    </p>
                  </div>
                  <button
                    v-if="!isEnterpriseOrder"
                    class="button-warning"
                    @click.stop="showRegenerateAccessorModal(orderId)">{{ $i18n.t('orders.REGENERATE_ACCESSOR') }}</button>
                </div>

                <ul
                  v-if="!isEnterpriseOrder"
                  class="references tabs">
                  <li
                    v-for="t in types"
                    :key="t"
                    :class="{ active: selectedType === t }"
                    class="reference"
                    @click="selectReference(t)">
                    <span>{{ t }}</span>
                  </li>
                </ul>

                <div class="section padded details">
                  <resource-details
                    :id="selectedResource.id"
                    :type="selectedResource.type"
                    :selected-references="selectedReferences"
                    :selected-type="selectedType"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <loading v-else/>
        <modal
          :height="'auto'"
          name="regenerateAccessorModal">
          <regenerateAccessor
            :order-id="orderId"
            @fetchAccessor="fetchAccessor" />
        </modal>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import resourcesMixin from '@/app/mixins/resources'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'
import resourceDetails from './resourceDetails'
import orderAPI from '@/app/api/order'
import regenerateAccessor from './regenerateAccessor'

export default {
  components: {
    top,
    loading,
    error,
    resourceDetails,
    regenerateAccessor
  },
  mixins: [
    resourcesMixin
  ],
  data () {
    return {
      order: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: ['HTTPProxy', 'OpenVPN', 'ShadowSOCKS', 'SSHTunnel'],
      accessorCheckPending: false
    }
  },
  computed: {
    isEnterpriseOrder () {
      return (this.order && this.order.line_items && this.order.line_items.length && this.order.line_items[0].type === 'ENTERPRISE')
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
            this.order = response.data.result
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
    showRegenerateAccessorModal (orderId) {
      this.$modal.show('regenerateAccessorModal', {
        orderId: orderId
      })
    }
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
