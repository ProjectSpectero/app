<template>
  <div class="auth">
    <div class="auth-container">
      <div class="logo-container">
        <div class="logo logo-md logo-dark"></div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.auth {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}
.auth-container {
  width: 350px;
  padding: $pad;
  color: $color-primary;
  background: $white;
  border: 1px solid $color-border;
  border-radius: 4px;
}
.logo-container {
  width: 100%;
  margin-bottom: $pad;
  text-align: center;
}
</style>
