<template>
  <form>
    <div class="container">
      <div class="col-12">
        <div class="section padded">
          <h2>Basic Details</h2>
          <div
            v-if="formError"
            class="message error">{{ formError }}
          </div>

          <div
            v-for="field in formFields"
            :key="field.model"
            class="input-container">

            <template v-if="field.type !== 'checkbox'">
              <div class="form-input">
                <div class="label">
                  <label :for="field.model">{{ field.label }}</label>
                </div>

                <input
                  v-validate="rules[field.model]"
                  :type="field.type"
                  :id="field.model"
                  :name="field.model"
                  v-model="form[field.model]"
                  :disabled="formDisable"
                  :data-vv-as="field.label.toLowerCase()"
                  :class="{'input-error': errors.has(field.model)}"
                  class="input">

                <div
                  v-show="errors.has(field.model)"
                  class="input-error-msg">
                  {{ errors.first(field.model) }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="mt-4">
                <p-input
                  :id="field.model"
                  :value="form[field.model]"
                  v-model="form[field.model]"
                  type="checkbox"
                  class="p-default p-curve">
                  {{ field.label }}
                </p-input>
              </div>
            </template>
          </div>

          <div class="section padded mt-5">
            <h2>Permissions</h2>
            <div class="checkbox-container">
              <ul>
                <li
                  v-for="permission in permissions"
                  :key="permission.id"
                  :class="{ disabled: permission.disabled }">
                  <p-input
                    :id="permission.id"
                    :value="permission.id"
                    :disabled="permission.disabled"
                    v-model="form.roles"
                    type="checkbox"
                    class="p-default p-curve">
                    {{ permission.label }}
                    <small v-if="permission.disabled">You don't have permission to set this.</small>
                  </p-input>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <button
              :disabled="formDisable"
              class="button-info"
              @click.prevent="submit"
              @keyup.enter="submit">
              {{ formDisable ? 'Please wait...' : title }}
            </button>
            <button
              class="button-light right"
              @click.prevent="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import userAPI from '@/daemon/api/user'

export default {
  props: {
    action: {
      type: String,
      default: 'edit'
    },
    user: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      title: 'Edit User',
      formError: null,
      formDisable: false,
      formFields: {},
      form: {
        authKey: null,
        password: null,
        emailAddress: null,
        fullName: null,
        roles: [],
        encryptCertificate: true
      }
    }
  },
  computed: {
    editRules () {
      return {
        authKey: {
          required: true,
          max: 50,
          regex: /^[a-zA-Z][\w]*$/
        },
        password: {
          max: 72
        },
        emailAddress: {
          required: true,
          email: true
        },
        fullName: {
          max: 50
        },
        encryptCertificate: {
          required: true
        }
      }
    },
    createRules () {
      let rules = JSON.parse(JSON.stringify(this.editRules))
      rules.password.required = true
      return rules
    },
    isSuperAdmin () {
      return this.user && (this.user.roles.indexOf('SuperAdmin') > -1)
    },
    permissions () {
      let permissions = [
        { id: 'SuperAdmin', label: 'SuperAdmin' },
        { id: 'WebApi', label: 'WebApi' },
        { id: 'HTTPProxy', label: 'HTTPProxy' },
        { id: 'OpenVPN', label: 'OpenVPN' },
        { id: 'ShadowSOCKS', label: 'ShadowSOCKS' },
        { id: 'SSHTunnel', label: 'SSHTunnel' }
      ]

      if (!this.isSuperAdmin) { // Disable SuperAdmin and WebApi checkboxes if not SuperAdmin
        permissions[0].disabled = true // SuperAdmin
        permissions[1].disabled = true // WebApi
      }

      return permissions
    }
  },
  created () {
    this.setup()
  },
  methods: {
    async fetchUser () {
      await userAPI.get({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.user = response.data.result
        },
        fail: e => {
          console.error(e)
          this.$router.push({ name: 'daemon' })
        }
      })
    },
    async setup () {
      // Set up basic form fields to avoid code repetition
      this.formFields = [
        { label: 'Username', type: 'text', model: 'authKey' },
        { label: 'Password', type: 'password', model: 'password' },
        { label: 'Email', type: 'email', model: 'emailAddress' },
        { label: 'Display Name', type: 'text', model: 'fullName' }
      ]

      // Set up the form. In this method we'll do two things:
      // 1) Take care of specific data fields (titles, etc.)
      // 2) Set the form fields array

      if (this.action === 'create') {
        this.title = 'Add User'
        this.rules = this.createRules

        // Setting certificate encription on/off is only available when creating a new user
        this.formFields.push({ label: 'Encrypt Certificate?', type: 'checkbox', model: 'encryptCertificate' })
      } else {
        this.form = Object.assign({}, this.user)
        this.rules = this.editRules
      }
    },
    submit () {
      this.formError = null
      this.errors.clear()

      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          this.formDisable = true
          this.formError = null

          // Handle submission according to chosen action
          if (this.action === 'create') {
            this.create()
          } else {
            this.update()
          }
        }
      })
    },
    create () {
      userAPI.create({
        data: this.form,
        success: (response) => {
          this.dealWithSuccess(response)
        },
        fail: (err) => {
          this.$toasted.error(this.$i18n.t('daemon.USER_UPDATE_ERROR'))
          this.dealWithErrors(err)
        }
      })
    },
    update () {
      if (this.user) {
        userAPI.edit({
          data: this.form,
          success: (response) => {
            this.dealWithSuccess(response)
          },
          fail: (err) => {
            this.$toasted.error(this.$i18n.t('daemon.USER_UPDATE_ERROR'))
            this.dealWithErrors(err)
          }
        })
      } else {
        throw new ReferenceError(this.$i18n.t('errors.USER_OBJECT_NOT_FOUND'))
      }
    },
    cancel () {
      this.$emit('canceled')
    },
    dealWithSuccess (response) {
      this.$emit('success')
    },
    dealWithErrors (err) {
      this.formDisable = false

      for (let errorKey in err.errors) {
        if (err.errors.hasOwnProperty(errorKey)) {
          this.formError = this.$i18n.t(`errors.${errorKey}`)
          break
        }
      }

      // Inject errors into form fields
      for (let inputName in err.fields) {
        if (err.fields.hasOwnProperty(inputName)) {
          let inputErrors = err.fields[inputName]

          for (let errorKey in inputErrors) {
            if (inputErrors.hasOwnProperty(errorKey)) {
              this.$validator.errors.add({
                id: `${inputName}_${errorKey}`,
                field: inputName,
                msg: this.$i18n.t(`errors.${inputName.toUpperCase()}_${errorKey}`, null, { x: inputErrors[errorKey] })
              })
            }
          }
        }
      }
    }
  }
}
</script>
