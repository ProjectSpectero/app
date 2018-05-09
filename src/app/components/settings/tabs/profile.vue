<template>
  <div>
    <h2>Profile</h2>

    <div class="col-container col-2">
      <div class="col-half">
        <form @submit.prevent.stop="submit">
          <h3>General Information</h3>
          <div class="message message-error" v-if="formError">{{ formError }}</div>

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
              <p v-html="$i18n.t('settings.EMAIL_CHANGE_NOTICE', { email: this.currentEmail })" class="spaced"></p>

              <div class="form-input">
                <float-label>
                  <input
                    type="email"
                    v-model="form.email"
                    name="email"
                    id="email"
                    placeholder="New Email Address"
                    class="input max-width"
                    :class="{'input-error': errors.has('email')}"
                    :disabled="formLoading"
                    v-validate="this.confirmedFieldRule('email', rules['email'])"
                    data-vv-as="new email">
                </float-label>

                <span v-show="errors.has('email')" class="input-error-message">
                  {{ errors.first('email') }}
                </span>
              </div>
              <div class="form-input">
                <float-label>
                  <input
                    type="email"
                    v-model="form.emailConfirm"
                    name="emailConfirm"
                    id="emailConfirm"
                    placeholder="Confirm Email Address"
                    class="input max-width"
                    :class="{'input-error': errors.has('emailConfirm')}"
                    :disabled="formLoading"
                    v-validate="rules['email']"
                    data-vv-as="new email confirmation">
                </float-label>

                <span v-show="errors.has('emailConfirm')" class="input-error-message">
                  {{ errors.first('emailConfirm') }}
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
                <float-label>
                  <input
                    type="password"
                    v-model="form.current_password"
                    name="passwordCurrent"
                    id="passwordCurrent"
                    placeholder="Current Password"
                    class="input max-width"
                    :disabled="formLoading"
                    data-vv-as="current password">
                </float-label>
              </div>

              <div class="form-input">
                <float-label>
                  <input
                    type="password"
                    v-model="form.password"
                    name="password"
                    id="password"
                    placeholder="New Password"
                    class="input max-width"
                    :class="{'input-error': errors.has('password')}"
                    :disabled="formLoading"
                    v-validate="this.confirmedFieldRule('password', rules['password'])"
                    data-vv-as="new password">
                </float-label>

                <span v-show="errors.has('password')" class="input-error-message">
                  {{ errors.first('password') }}
                </span>
              </div>

              <div class="form-input">
                <float-label>
                  <input
                    type="password"
                    v-model="form.passwordConfirm"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    placeholder="Confirm New Password"
                    class="input max-width"
                    :class="{'input-error': errors.has('passwordConfirm')}"
                    :disabled="formLoading"
                    v-validate="rules['password']"
                    data-vv-as="new password confirmation">
                </float-label>

                <span v-show="errors.has('passwordConfirm')" class="input-error-message">
                  {{ errors.first('passwordConfirm') }}
                </span>
              </div>
            </div>
          </div>

          <button v-if="showEmailForm || showPasswordForm" type="submit" class="button button-info button-md max-width" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
            Save Changes
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
    user: Object,
    formError: String,
    formLoading: Boolean,
    processForm: Function
  },
  metaInfo: {
    title: 'Profile'
  },
  data () {
    return {
      form: null,
      currentEmail: null,
      showEmailForm: false,
      showPasswordForm: false
    }
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.currentEmail = this.form.email
  },
  computed: {
    ...mapGetters({
      rules: 'appUsers/editRules'
    })
  },
  methods: {
    toggleEmailEdit () {
      this.showEmailForm = !this.showEmailForm
    },
    togglePasswordEdit () {
      this.showPasswordForm = !this.showPasswordForm
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          this.$emit('processForm', this.form)
        }
      })
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
