<template>
  <div v-if="contentsKey && showHelp" class="help">
    <div class="top">
      <div class="title">Help</div>
      <button @click="close" class="modal-close"></button>
    </div>

    <div class="content">
      <contents :items="items"></contents>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import contents from '@/shared/components/docs/contents'
import translations from '@/shared/lang/en'

export default {
  computed: {
    ...mapGetters({
      showHelp: 'help/showHelp',
      contentsKey: 'help/contentsKey'
    }),
    items () {
      return this.contentsKey ? this.contentsKey.split('.').reduce((o, i) => o[i], translations) : null
    }
  },
  methods: {
    ...mapActions({
      togglePanel: 'help/togglePanel'
    }),
    close () {
      this.togglePanel()
    }
  },
  components: {
    contents
  }
}
</script>

<style lang="scss" scoped>
  .help {
    background: #e6e8ef;
    width: 20%;
    border-left: 1px solid #c8cad1;
    overflow-y: auto;
  }

  .top {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #c8cad1;
    font-size: 18px;

    > .title {
      flex: 1;
    }

    > .modal-close {
      margin-left: 0;
    }
  }

  .content {
    padding: 1rem;
  }
</style>
