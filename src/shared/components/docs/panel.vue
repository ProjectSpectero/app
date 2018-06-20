<template>
  <div
    v-if="contentsKey && showHelp"
    class="help">
    <div class="top">
      <div class="title">Help</div>
      <button
        class="modal-close"
        @click="close"/>
    </div>

    <div class="content">
      <contents
        :items="items"
        :child="true"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import contents from '@/shared/components/docs/contents'
import translations from '@/shared/lang/en'

export default {
  components: {
    contents
  },
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
  }
}
</script>

<style lang="scss" scoped>
.help {
  width: 25%;
  background: $color-bg;
  box-shadow: 0px 0px 5px 0px rgba(33, 41, 56, 0.15);
  overflow-y: auto;
  z-index: 1;
}

.top {
  height: 80px;
  display: flex;
  align-items: center;
  padding: $pad;
  font-size: 18px;
  font-weight: $font-semi;
  background: #fff;
  box-shadow: 0px 0px 5px 0px rgba(33, 41, 56, 0.15);

  > .title {
    flex: 1;
  }

  > .modal-close {
    margin-left: 0;
  }
}

.content {
  padding: 14px;

  .container {
    padding: $pad;
  }
  .child {
    padding: $pad;
    background: $white;
    border: 1px solid $color-border;
    border-radius: 4px;
  }
}
</style>
