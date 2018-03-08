<template>
  <div>
    <h2>Profile</h2>

    <div class="col-container col-2">
      <div class="col-half">
        <form @submit.prevent.stop="submit">
          <h3>General Information</h3>
          <div class="message error" v-if="formError">{{ formError }}</div>

          <div class="change-email">
            <div class="form-input">
              <div class="label"><label for="email"><strong>Email Address</strong></label></div>
              <div v-if="!showEmailForm" class="profile-edit-input">
                <input
                  type="email"
                  :value="form.email"
                  name="emailPlaceholder"
                  id="emailPlaceholder"
                  placeholder="Email Address"
                  class="input max-width"
                  disabled>

                <a @click.prevent.stop="toggleEmailEdit" role="button" class="profile-edit-link">Change email</a>
              </div>
            </div>
            <div v-if="showEmailForm" class="change-email-form">
              <p class="spaced">Your current email is <strong>{{ this.form.email }}</strong>. If your new email is invalid we will not be able to reach you and your account will be locked.</p>

              <div class="form-input">
                <input
                  type="email"
                  v-model="form.emailChange"
                  name="emailChange"
                  id="emailChange"
                  placeholder="New Email Address"
                  class="input max-width"
                  :class="{'input-error': errors.has('emailChange')}"
                  :disabled="formDisable"
                  v-validate="confirmedFieldRule('emailChange', rules['email'])"
                  data-vv-as="new email">

                <span v-show="errors.has('emailChange')" class="input-error-message">
                  {{ errors.first('emailChange') }}
                </span>
              </div>
              <div class="form-input">
                <input
                  type="email"
                  v-model="form.emailChangeConfirm"
                  name="emailChangeConfirm"
                  id="emailChangeConfirm"
                  placeholder="Confirm Email Address"
                  class="input max-width"
                  :class="{'input-error': errors.has('emailChangeConfirm')}"
                  :disabled="formDisable"
                  v-validate="rules['email']"
                  data-vv-as="new email confirmation">

                <span v-show="errors.has('emailChangeConfirm')" class="input-error-message">
                  {{ errors.first('emailChangeConfirm') }}
                </span>
              </div>
            </div>
          </div>

          <div class="change-password">
            <div class="form-input">
              <div class="label"><label for="password"><strong>Password</strong></label></div>
              <div v-if="!showPasswordForm" class="profile-edit-input">
                <input
                  type="password"
                  value="••••••••"
                  name="passwordPlaceholder"
                  id="passwordPlaceholder"
                  placeholder="Password"
                  class="input max-width"
                  disabled>

                <a @click.prevent.stop="togglePasswordEdit" role="button" class="profile-edit-link">Change password</a>
              </div>
            </div>
            <div v-if="showPasswordForm" class="change-password-form">
              <div class="form-input">
                <input
                  type="password"
                  v-model="form.current_password"
                  name="passwordCurrent"
                  id="passwordCurrent"
                  placeholder="Current Password"
                  class="input max-width"
                  :disabled="formDisable"
                  data-vv-as="current password">
              </div>

              <div class="form-input">
                <input
                  type="password"
                  v-model="form.passwordChange"
                  name="passwordChange"
                  id="passwordChange"
                  placeholder="New Password"
                  class="input max-width"
                  :class="{'input-error': errors.has('passwordChange')}"
                  :disabled="formDisable"
                  v-validate="confirmedFieldRule('passwordChange', rules['password'])"
                  data-vv-as="new password">

                <span v-show="errors.has('passwordChange')" class="input-error-message">
                  {{ errors.first('passwordChange') }}
                </span>
              </div>

              <div class="form-input">
                <input
                  type="password"
                  v-model="form.passwordChangeConfirm"
                  name="passwordChangeConfirm"
                  id="passwordChangeConfirm"
                  placeholder="Confirm New Password"
                  class="input max-width"
                  :class="{'input-error': errors.has('passwordChangeConfirm')}"
                  :disabled="formDisable"
                  v-validate="rules['password']"
                  data-vv-as="new password confirmation">

                <span v-show="errors.has('passwordChangeConfirm')" class="input-error-message">
                  {{ errors.first('passwordChangeConfirm') }}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    user: Object
  },
  data () {
    return {
      formError: null,
      formDisable: null,
      form: null,
      showEmailForm: false,
      showPasswordForm: false
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.user))
  },
  computed: {
    ...mapGetters({
      rules: 'users/editRules'
    })
  },
  methods: {
    toggleEmailEdit () {
      this.showEmailForm = !this.showEmailForm
    },
    togglePasswordEdit () {
      this.showPasswordForm = !this.showPasswordForm
    },
    confirmedFieldRule: function (inputName, rules) {
      rules.confirmed = inputName + 'Confirm'
      return rules
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-edit-input {
  position: relative;

  .input[disabled] {
    cursor: default;
  }
}
.profile-edit-link {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
