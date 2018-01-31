<template>
  <modal :name="name" :adaptive="true" height="auto" width="500px" :scrollable="true" @before-open="beforeOpen">
    <div class="modal-title">
      <h2>View Certificate</h2>
      <button class="modal-close" @click.prevent="closeModal"></button>
    </div>
    <div class="pad">
      <form>
        <div class="item">
          <div class="label"><label for="authKey">Username:</label></div>
          <textarea class="input font-mono" id="authKey" v-model="authKey" readonly></textarea>
        </div>
        <div class="item">
          <div class="label"><label for="certificate">Certificate:</label></div>
          <textarea class="input font-mono" id="certificate" v-model="cert" readonly></textarea>
        </div>
        <div class="item">
          <div class="label"><label for="key">Key:</label></div>
          <textarea class="input font-mono" id="key" v-model="certKey" readonly></textarea>
        </div>
        <button class="button" @click.prevent="closeModal">Close</button>
      </form>
    </div>
  </modal>
</template>

<script>
  export default {
    props: {
      name: String
    },
    data () {
      return {
        user: {},
        cert: null,
        certKey: null,
        authKey: null
      }
    },
    methods: {
      closeModal () {
        this.$modal.hide(this.name)
      },
      beforeOpen (event) {
        this.reset()
        this.user = event.params.user
        this.cert = this.user.cert
        this.certKey = this.user.certKey
        this.authKey = this.user.authKey
      },
      reset () {
        Object.assign(this.$data, this.$options.data.call(this))
      }
    }
  }
</script>

<style lang="scss" scoped>
  form {
    .item {
      margin-bottom: 16px;
    }
    textarea {
      height: 108px;
      min-height: auto;
    }
    #authKey {
      height: 44px;
    }
  }
</style>