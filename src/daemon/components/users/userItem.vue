<template>
  <article :class="user.status">
    <section class="info">
      <div class="avatar">{{ initials }}</div>
      <div class="text">
        <div class="displayName">
          <h2>{{ displayName }}</h2>
        </div>
        <span class="username" v-if="user.fullName">
          {{ user.authKey }}
        </span>
      </div>
    </section>
    <section class="active">
      {{ user.lastLoginDate | moment('from') }}
    </section>
    <section class="source">
      {{ user.source }}
    </section>
    <section class="roles">
      {{ roles }}
    </section>
    <section class="actions">
      <button @click="triggerModal('deleteUser')">
        <span class="icon icon-trash"></span>
      </button>
      <button @click="triggerModal('editUser')">
        <span class="icon icon-pencil"></span>
      </button>
      <button @click="triggerModal('userCert')">
        <span class="icon icon-lock"></span>
      </button>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    user: Object
  },
  computed: {
    displayName () {
      return this.user.fullName ? this.user.fullName : this.user.authKey
    },
    initials () {
      const initials = this.displayName.match(/\b\w/g) || []
      return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
    },
    roles () {
      return this.user.roles.join(', ')
    }
  },
  methods: {
    triggerModal (action) {
      this.$modal.show(action, { user: this.user })
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../../assets/styles/_vars.scss';

article {
  // background: $darker;
  border-radius: 4px;

  .info {
    display: flex;
    align-items: center;

    .avatar {
      width: 40px;
      height: 40px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      float: left;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      background: #3855F2;
      border-radius: 100%;
    }
    .text {
      margin-left: 14px;
    }
    .displayName {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      h2 {
        display: inline-block;
        font-size: 16px;
        line-height: 100%;
        padding-right: 2px;

        &::after {
          content: '';
          width: 8px;
          height: 8px;
          display: inline-block;
          margin-left: 4px;
          border-radius: 4px;
          position: relative;
          top: -2px;
          left: 2px;
        }
      }
      h3 {
        margin-left: 6px;
        color: rgba(255,255,255,0.3);
        font-size: 14px;
        line-height: 100%;
        font-weight: 400;
      }
    }
    span.username {
      margin-top: 6px;
      display: block;
      font-size: 14px;
      line-height: 100%;
      color: rgba(255,255,255,0.3);
    }
  }
  &.online {
    .info h2::after {
      background: #18FF6D;
    }
  }
  &.offline {
    .info h2::after {
      background: #FF5964;
    }
  }
  .actions {
    max-width: 100px !important;
    cursor: default;
    padding-right: 14px;
    text-align: right;

    button {
      padding: 0;
      border: 0;
      font-size: 18px;
      line-height: 100%;
      font-weight: 600;
      background: transparent;
      color: rgba(255,255,255,0.2);
      margin-right: 4px;

      &:hover {
        background: transparent;
        color: #fff;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
