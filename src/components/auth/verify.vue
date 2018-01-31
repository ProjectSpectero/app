<template>
  <div>
    <p>To be implemented.</p>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  },
  metaInfo: {
    title: 'Verify Email'
  }
}
</script>
