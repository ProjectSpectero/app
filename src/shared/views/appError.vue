<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.ERROR_GENERIC_ITEM_TITLE') }}</h1>
    <p>{{ $t('errors.ERROR_GENERIC_ITEM_TEXT') }}</p>

    <div class="datatable my-5">
      <table>
        <tbody>
          <tr>
            <td>
              <div :class="log.type === 'error' ? 'badge-danger' : 'badge-warning'">
                {{ log.type }}
              </div>
            </td>
            <td class="date">{{ log.date }}</td>
          </tr>
          <tr>
            <td colspan="3">{{ log.stack }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      :to="{ name: 'dashboard' }"
      class="button is-info">{{ $t('misc.GO_TO_DASHBOARD') }}</router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      appError: 'error/error'
    })
  },
  data () {
    return {
      log: null
    }
  },
  created () {
    if (!this.appError.date) {
      this.$router.push({ name: 'dashboard' })
    }

    this.log = Object.assign({}, this.appError)
    this.clear()
  },
  methods: {
    ...mapActions({
      clear: 'error/clear'
    })
  }
}
</script>

<style lang="scss" scoped>
.alert-msg-centered {
  .datatable  {
    margin: 0 auto;
    width: 60%;

    td {
      background: $white;
      padding: $pad;

      &.date {
        text-align: right;
      }
    }
  }
}
</style>
