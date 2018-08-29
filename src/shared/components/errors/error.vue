<template>
  <component
    :is="'error' + code"
    :item="item"/>
</template>

<script>
import error400 from '@/shared/components/errors/error400'
import error404 from '@/shared/components/errors/error404'

export default {
  components: {
    error400,
    error404
  },
  props: {
    code: {
      type: Number,
      required: false,
      default: 0
    },
    item: {
      type: String,
      required: false,
      default: 'item'
    }
  }
}
</script>
