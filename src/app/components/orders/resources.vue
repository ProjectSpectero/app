<template>
  <div>
    <top title="Order Resources">
      <h4>Order #{{ $route.params.id }}</h4>
    </top>
    <div v-if="resources">
      <div class="content-split">
        <div class="split-item split-list filters-side">
          <div v-for="item in resources" :key="item.id" class="filter-link" :class="{ active: selectedResource === item }" @click="selectResource(item)">
            <span>Item {{ item.id }} ({{ item.type }})</span>
          </div>
        </div>
        <div class="split-item split-details">
          <div class="references">
            <div v-for="t in types" :key="t" @click="selectReference(t)" class="reference" :class="{ active: selectedType === t }">
              <span>{{ t }}</span>
            </div>
          </div>

          <template v-if="selectedReferences">
            <div class="details" v-for="(field, j) in selectedReferences" :key="j">
              <div>
                <div class="label"><label>Accessor</label></div>
                <div v-for="(a, x) in accessor" :key="x">
                  <div>{{ x }}: {{ a }}</div>
                </div>
              </div>
              <div>
                <div class="label">
                  <label>Access Reference</label>
                  <button v-clipboard:copy="field.accessReference" v-clipboard:success="copyToClipboard">
                    {{ $i18n.t('misc.COPY_TO_CLIPBOARD') }}
                  </button>
                </div>
                <div class="ips">
                    {{ field.accessReference }}
                </div>
              </div>
              <div>
                <div class="label">
                  <label>Access Config</label>
                  <button v-clipboard:copy="field.accessConfig" v-clipboard:success="copyToClipboard">
                    {{ $i18n.t('misc.COPY_TO_CLIPBOARD') }}
                  </button>
                </div>
                <textarea class="input" v-model="field.accessConfig" readonly></textarea>
              </div>
              <div>
                <div class="label"><label>Access Credentials</label></div>
                <div>{{ field.accessCredentials }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <p>{{ $i18n.t('orders.NOT_ENABLED', { type: selectedType }) }}</p>
          </template>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      accessor: null,
      resources: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: ['HTTPProxy', 'OpenVPN', 'ShadowSOCKS', 'SSHTunnel']
    }
  },
  created () {
    this.fetchResources()
  },
  methods: {
    async fetchResources () {
      await orderAPI.resources({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.accessor = response.data.result.accessor ? this.parseAccessor(response.data.result.accessor) : ''
          this.buildResourceTree(response.data.result.resources)
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
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
    selectResource (item) {
      let sortedReferences = {}
      let selectedType = null

      this.selectedResource = item

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

      // Select first reference type by default
      this.selectReference(selectedType)
    },
    selectReference (type) {
      this.selectedType = type
      this.selectedReferences = this.selectedResource.references[type]
    },
    copyToClipboard (e) {
      this.$toasted.success(this.$i18n.t('misc.COPIED_TO_CLIPBOARD'))
    }
  },
  components: {
    top,
    loading
  }
}
</script>

<style lang="scss" scoped>
  .references {
    display: flex;
    margin: 0 0 1rem;

    .reference {
      margin-right: 1rem;
      cursor: pointer;

      &.active {
        font-weight: 600;
        cursor: default;
      }
    }
  }

  .details {
    margin-bottom: $pad;
    padding: $pad;
    border-radius: 4px;
    border: 1px solid $color-border;
    width: 80%;

    > div {
      margin-bottom: 1rem;
    }

    input, textarea {
      width: 100%;
    }

    textarea {
      height: 300px;
    }
  }
</style>
