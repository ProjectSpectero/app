<template>
  <div>
    <h2>Profile</h2>
    <div class="grid-container">
      <div class="col-6">
        <form @submit.prevent.stop="submit">
          <h3>General Information</h3>
          <div
            v-if="formError"
            class="message message-error">{{ formError }}</div>

          <div class="change-email">
            <div class="form-input">
              <div class="label"><label for="email"><strong>Email Address</strong></label></div>
              <div
                v-if="!showEmailForm"
                class="profile-edit-input">
                <input
                  id="emailPlaceholder"
                  :value="form.email"
                  type="email"
                  name="emailPlaceholder"
                  placeholder="Email Address"
                  class="input max-width"
                  disabled>

                <a
                  role="button"
                  class="profile-edit-link"
                  @click.prevent.stop="toggleEmailEdit">Change email</a>
              </div>
            </div>
            <div
              v-if="showEmailForm"
              class="change-email-form">
              <p
                class="spaced"
                v-html="$i18n.t('settings.EMAIL_CHANGE_NOTICE', { email: currentEmail })"/>

              <div class="form-input">
                <float-label>
                  <input
                    v-validate="confirmedFieldRule('email', rules['email'])"
                    id="email"
                    v-model="form.email"
                    :class="{'input-error': errors.has('email')}"
                    :disabled="formLoading"
                    type="email"
                    name="email"
                    placeholder="New Email Address"
                    class="input max-width"
                    data-vv-as="new email">
                </float-label>

                <span
                  v-show="errors.has('email')"
                  class="input-error-message">
                  {{ errors.first('email') }}
                </span>
              </div>
              <div class="form-input">
                <float-label>
                  <input
                    v-validate="rules['email']"
                    id="emailConfirm"
                    v-model="form.emailConfirm"
                    :class="{'input-error': errors.has('emailConfirm')}"
                    :disabled="formLoading"
                    type="email"
                    name="emailConfirm"
                    placeholder="Confirm Email Address"
                    class="input max-width"
                    data-vv-as="new email confirmation">
                </float-label>

                <span
                  v-show="errors.has('emailConfirm')"
                  class="input-error-message">
                  {{ errors.first('emailConfirm') }}
                </span>
              </div>
            </div>
          </div>

          <div class="change-password">
            <div class="form-input">
              <div class="label"><label for="password"><strong>Password</strong></label></div>
              <div
                v-if="!showPasswordForm"
                class="profile-edit-input">
                <input
                  id="passwordPlaceholder"
                  type="password"
                  value="••••••••"
                  name="passwordPlaceholder"
                  placeholder="Password"
                  class="input max-width"
                  disabled>

                <a
                  role="button"
                  class="profile-edit-link"
                  @click.prevent.stop="togglePasswordEdit">Change password</a>
              </div>
            </div>
            <div
              v-if="showPasswordForm"
              class="change-password-form">
              <div class="form-input">
                <float-label>
                  <input
                    id="passwordCurrent"
                    v-model="form.current_password"
                    :disabled="formLoading"
                    type="password"
                    name="passwordCurrent"
                    placeholder="Current Password"
                    class="input max-width"
                    data-vv-as="current password">
                </float-label>
              </div>

              <div class="form-input">
                <float-label>
                  <input
                    v-validate="confirmedFieldRule('password', rules['password'])"
                    id="password"
                    v-model="form.password"
                    :class="{'input-error': errors.has('password')}"
                    :disabled="formLoading"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    class="input max-width"
                    data-vv-as="new password">
                </float-label>

                <span
                  v-show="errors.has('password')"
                  class="input-error-message">
                  {{ errors.first('password') }}
                </span>
              </div>

              <div class="form-input">
                <float-label>
                  <input
                    v-validate="rules['password']"
                    id="passwordConfirm"
                    v-model="form.passwordConfirm"
                    :class="{'input-error': errors.has('passwordConfirm')}"
                    :disabled="formLoading"
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirm New Password"
                    class="input max-width"
                    data-vv-as="new password confirmation">
                </float-label>

                <span
                  v-show="errors.has('passwordConfirm')"
                  class="input-error-message">
                  {{ errors.first('passwordConfirm') }}
                </span>
              </div>
            </div>
          </div>

          <button
            v-if="showEmailForm || showPasswordForm"
            :class="{ 'button-loading': formLoading }"
            :disabled="formLoading"
            type="submit"
            class="button-info button-md max-width">
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
  metaInfo: {
    title: 'Profile'
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    formError: {
      type: String,
      required: true
    },
    formLoading: {
      type: Boolean,
      required: true
    },
    processForm: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      form: null,
      currentEmail: null,
      showEmailForm: false,
      showPasswordForm: false
    }
  },
  computed: {
    ...mapGetters({
      rules: 'appUsers/editRules'
    })
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.currentEmail = this.form.email
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
  top: 14px;
  right: 16px;
}
</style>
