<template>
  <component :is="'error' + code" :item="item"></component>
</template>

<script>
import error400 from './error400'
import error404 from './error404'

export default {
  props: {
    code: Number,
    item: String
  },
  components: {
    error400,
    error404
  }
}
</script>
