<template>
  <div v-if="user">
    <div class="item">
      <div class="label"><label for="authKey">Username:</label></div>
      <textarea class="input font-mono" id="authKey" v-model="user.authKey" readonly></textarea>
    </div>
    <div class="item">
      <div class="label"><label for="certificate">Certificate:</label></div>
      <textarea class="input font-mono" id="certificate" v-model="user.cert" readonly></textarea>
    </div>
    <div class="item">
      <div class="label"><label for="key">Key:</label></div>
      <textarea class="input font-mono" id="key" v-model="user.certKey" readonly></textarea>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user'
    })
  }
}
</script>
