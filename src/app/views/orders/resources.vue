<template>
  <div>
    <template v-if="!error">
      <div v-if="resources">
        <top :title="'Order '+ orderId +' Resources'">
          <router-link
            :to="{ name: 'order', params: { id: orderId } }"
            class="button">
            {{ $t('orders.BACK_TO_ORDER') }}
          </router-link>
        </top>
        <div v-if="resources.length">
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
                    {{ $t('misc.ITEM') }} {{ item.id }}
                  </div>
                  <div class="count">
                    {{ item.type === 'NODE_GROUP' ? $t('misc.NODE_GROUP') : $t('misc.NODE') }}
                  </div>
                </div>
              </div>
              <div class="split-details">
                <div
                  v-if="accessor"
                  class="accessor">
                  <div class="credentials">
                    <div class="label">
                      <label>{{ $t('orders.ACCESSOR_DETAILS') }}</label>
                    </div>

                    <p>{{ $t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
                    <p>{{ $t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>

                    <p
                      v-if="accessorCheckPending"
                      class="changeWarning">
                      {{ $t('orders.ACCESSOR_DETAILS_TEXT') }}
                    </p>
                  </div>
                  <button
                    v-if="!isEnterpriseOrder"
                    class="button is-warning"
                    @click.stop="showRegenerateAccessorModal(orderId)">{{ $t('orders.REGENERATE_ACCESSOR') }}</button>
                </div>

                <ul
                  v-if="!isEnterpriseOrder"
                  class="references tabs tabs-inline">
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

          <modal
            :height="'auto'"
            name="regenerateAccessorModal">
            <regenerateAccessor
              :order-id="orderId"
              @fetchAccessor="fetchAccessor" />
          </modal>
        </div>
        <div
          v-else
          class="boxed boxed-centered">
          <div class="boxed-container boxed-md">
            <div class="message is-info mb-0">
              <div class="message-body">{{ $t('orders.RESOURCES_NOT_FOUND') }}</div>
            </div>
          </div>
        </div>
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
import orderMixin from '@/app/mixins/order'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'
import resourceDetails from '@/app/components/orders/resourceDetails'
import orderAPI from '@/app/api/order'
import regenerateAccessor from '@/app/components/orders/regenerateAccessor'

export default {
  components: {
    top,
    loading,
    error,
    resourceDetails,
    regenerateAccessor
  },
  mixins: [
    resourcesMixin,
    orderMixin
  ],
  metaInfo () {
    return {
      title: 'Order ' + this.orderId + ' Resources'
    }
  },
  data () {
    return {
      order: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: [
        'HTTPProxy',
        'OpenVPN'
        // 'ShadowSOCKS',
        // 'SSHTunnel'
      ],
      accessorCheckPending: false
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
