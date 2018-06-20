<template>
  <div class="processing">
    <header>
      <h5>{{ $i18n.t('invoices.RESOURCES_NOT_AVAILABLE') }}</h5>
      <p>{{ $i18n.t('invoices.RESOURCES_NOT_AVAILABLE_TEXT') }}</p>
    </header>
    <section class="body">
      <processing-errors
        :error-bag="errorBag"
        :invoice="invoice"
        @close="update"/>
    </section>
  </div>
</template>

<script>
import processingErrors from './processingErrors'

export default {
  components: {
    processingErrors
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    errorBag: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    update () {
      this.$emit('update')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/icons';

.processing {
  margin-bottom: $pad;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid $color-danger;

  header {
    padding: 16px;
    color: $white;
    background: $color-danger;

    h5 {
      margin-bottom: 0;

      &:before {
        @extend [class^="icon-"];
        @extend .icon-alert-circle:before;

        position: relative;
        top: 1px;
        margin-right: 6px;
      }
    }
    p {
      margin-top: 0.7em;
      opacity: 0.8;
    }
  }
  .body {
    padding: 16px;
    background: $white;
  }
}

@media print {
  .processing {
    display: none !important;
  }
}
</style>
