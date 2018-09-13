<template>
  <div class="message mb-3">
    <div class="message-body">
      <h5>Need to manage this node's resources?</h5>
      <p>
        In order to access this <strong>Unlisted</strong> node's services, you'll need to
        <router-link :to="{ name: 'daemon-user-create' }">
          add a local account
        </router-link>. This will allow you to access and download all the configuration data of your services.
      </p>
    </div>
  </div>
</template>
