<template>
  <div>
    <h5>DHCP Settings</h5>
    <div class="add">
      <div class="input-float input-with-tooltip tooltip-space">
        <select v-model="item1">
          <option
            v-for="(option, i) in dhcp"
            :key="i"
            :value="option.id">
            {{ $i18n.t(`cloud.dhcp.${option.label}`) }}
          </option>
        </select>
        <tooltip id="services.topics.dhcpOptions"/>
      </div>
      <div class="input-float">
        <input
          id="dhcp_item2"
          v-model="item2"
          name="dhcp_item2"
          type="text"
          placeholder="DHCP Item 2"
          class="input">
        <div
          v-show="errors.has('dhcp_item2')"
          class="input-error-msg">
          {{ errors.first('dhcp_item2') }}
        </div>
      </div>
      <button
        class="button-md button-success"
        @click.prevent="add">
        Add DHCP Item
      </button>
    </div>
    <div
      v-if="list.length > 0"
      class="ip-list">
      <ul>
        <li
          v-for="(listener, index) in list"
          :key="index"
          class="list-item">
          <div class="ip-label">
            <strong>{{ listener.item1 }}</strong>{{ (listener.item2) ? ` - ${listener.item2}` : `` }}
          </div>
          <button
            class="button-sm button-icon"
            @click.prevent="remove(index)">
            <span class="icon-x"/>
          </button>
        </li>
      </ul>
    </div>
    <p
      v-else
      class="none">No DHCP options added yet.</p>
  </div>
</template>

<script>
import tooltip from '@/shared/components/tooltip'
import dhcp from '@/shared/helpers/dhcp'

export default {
  components: {
    tooltip
  },
  props: {
    dhcpItems: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      list: [],
      dhcp: dhcp,
      item1: dhcp[0].id,
      item2: ''
    }
  },
  methods: {
    remove (index) {
      this.list.splice(index, 1)
      this.update()
    },
    add () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.list.push({
            item1: this.item1,
            item2: this.item2
          })

          this.update()
          this.reset()
        }
      })
    },
    update () {
      this.$emit('update', this.list)
    },
    reset () {
      this.$validator.reset()
      this.item1 = this.dhcp[0].id
      this.item2 = null
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.input-float {
  flex: 1;
  margin-right: 12px;
}
.ip-list {
  margin-top: $pad;

  ul {
    max-height: 490px;
    overflow-y: auto;
    list-style: none;
  }
  li {
    padding: 8px 8px 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:nth-child(2n+1) {
      background: $color-smoke;
    }
  }
}
.none {
  margin-top: $pad;
}
</style>
