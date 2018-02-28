<template>
  <div>
    <top title="Nodes"></top>

    <div v-if="groups" class="list pad-margin">
      <div class="left">
        <div v-for="group in groups" :key="group.id" @click="selectGroup(group)" :class="{ selectedGroup: 'active' }">
          <div>Group #{{ group.id }}</div>
          <small>({{ group.nodes.length }} nodes)</small>
        </div>
      </div>
      <div class="right">
        <div v-if="nodes" class="nodes">
          <div v-for="node in nodes" :key="node.id">
            <div class="details">
              Node #{{ node.id }}
            </div>

            <div class="actions">
              <router-link class="button" :to="{ name: 'node', params: { id: node.id } }">
                Manage
              </router-link>

              <router-link class="button" :to="{ name: 'nodeEdit', params: { id: node.id } }">
                Edit
              </router-link>

              <button class="button" @click.stop="removeNode(node.id)">Remove</button>
            </div>
          </div>
        </div>
        <p v-else>No nodes found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Top from '../common/top'
import nodeAPI from '@/api/node.js'

export default {
  components: {
    Top
  },
  data () {
    return {
      groups: null,
      selectedGroup: null,
      nodes: null
    }
  },
  created () {
    this.fetchNodes()
  },
  methods: {
    selectGroup (group) {
      this.nodes = group.nodes
    },
    removeNode (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_CONFIRM_DIALOG'))) {
        nodeAPI.delete({
          data: {
            id: id
          },
          success: response => {
            this.formError = null
            this.fetchNodes()
            this.$toasted.show(this.$i18n.t('nodes.DELETE_SUCCESS'))
          },
          fail: error => {
            this.$toasted.error(this.$i18n.t('nodes.DELETE_ERROR'))
            this.formError = error.data.errors[0]
            this.formDisable = false
          }
        })
      }
    },
    fetchNodes () {
      nodeAPI.nodeGroups({
        success: response => {
          if (response.data.result) {
            this.groups = response.data.result
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.error = this.$i18n.t(`errors.${keys[0]}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list {
    display: flex;
    background: #fff;

    .left {
      width: 25%;
      border: 1px solid #ddd;
      border-bottom: 0;

      > div {
        border-bottom: 1px solid #ddd;
        height: 60px;
        padding: 1rem;
        cursor: pointer;
      }
    }

    .right {
      width: 75%;

      .nodes {
        > div {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid #ddd;

          .actions {
            margin-left: auto;
          }
        }
      }
    }
  }
</style>
