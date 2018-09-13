<template>
  <div class="section">
    <h2>Available IP Addresses</h2>
    <p>These IP addresses are available for you to add listeners with.</p>

    <div class="ip-list">
      <ul>
        <li
          v-for="(ip, i) in ips"
          :key="i">
          <div class="ip-label">
            {{ ip }}
          </div>
          <button
            class="is-small"
            @click.prevent="$emit('fillAddress', ip)">
            Fill Address
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ips: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.ip-list {
  margin-top: $pad;
  padding-top: $pad;
  border-top: 1px solid $color-border;

  ul {
    max-height: 240px;
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
</style>
