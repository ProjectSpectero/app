<template>
  <div>
    <h2>Node Keys</h2>

    <div class="col-container col-2">
      <div class="col-half">
        <form @submit.prevent.stop="submit">
          <h3>Regenerate Node Key</h3>
          <div class="message error" v-if="formError">{{ formError }}</div>

          <div class="form-input">
            <button class="button button-info" @click.prevent.stop="regenerateNodeKey">Regenerate Node Key</button>
            <p v-if="nodeKey" class="mt-3">Your node key was set to <strong>{{ nodeKey }}</strong>.</p>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  props: {
    user: Object
  },
  data () {
    return {
      formError: null,
      formDisable: null,
      form: null
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.user))
  }
}
</script>

<style lang="scss" scoped>

</style>
