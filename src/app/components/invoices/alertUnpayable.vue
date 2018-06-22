<template>
  <div class="unpayable">
    <header>
      <h5>{{ $i18n.t('invoices.UNPAYABLE') }}</h5>
      <p>{{ $i18n.t('invoices.UNPAYABLE_TEXT') }}</p>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    invoice: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/icons';

.unpayable {
  margin-bottom: $pad;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid $color-warning;

  header {
    padding: 16px;
    color: rgba(0,0,0,0.8);
    background: $color-warning;

    h5 {
      margin-bottom: 0;

      &:before {
        @extend [class^="icon-"];
        @extend .icon-alert-triangle:before;

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
  .unpayable {
    display: none !important;
  }
}
</style>
