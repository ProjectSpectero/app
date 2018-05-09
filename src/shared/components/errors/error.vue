<template>
  <component :is="'error' + code" :item="item"></component>
</template>

<script>
import error404 from './error404'

export default {
  props: {
    code: Number,
    item: String
  },
  components: {
    error404
  }
}
</script>
