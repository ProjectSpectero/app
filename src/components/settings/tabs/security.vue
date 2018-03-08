<template>
  <div>
    <h2>Security</h2>

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
