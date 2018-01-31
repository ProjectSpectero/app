<template>
  <form>
    <div class="container container-600">
      <div class="pad">
        <h2>Basic Details</h2>
        <div class="message error" v-if="formError">{{ formError }}</div>

        <div v-for="field in formFields" :key="field.model" class="input-container">
          <div class="label">
            <label :for="field.model">{{ field.label }}</label>
          </div>

          <input
            :type="field.type"
            :id="field.model"
            class="input"
            :name="field.model"
            v-model="form[field.model]"
            :disabled="formDisable"
            v-validate="rules[field.model]"
            :data-vv-as="field.label.toLowerCase()"
            :class="{'input-error': errors.has(field.model)}">

          <span v-show="errors.has(field.model)" class="input-error-msg">
            {{ errors.first(field.model) }}
          </span>
        </div>
      </div>
    </div>
    <div class="container container-600">
      <div class="pad">
        <h2>Permissions</h2>
        <div class="checkbox-container">
          <ul>
            <li v-for="permission in permissions" :key="permission.id" :class="{ disabled: permission.disabled }">
              <input type="checkbox" :id="permission.id" :value="permission.id" :disabled="permission.disabled" v-model="form.roles">
              <label :for="permission.id">
                {{ permission.label }}
                <small v-if="permission.disabled">You don't have permission to set this.</small>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-bottom">
        <button class="button button-info" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">
          {{ formDisable ? 'Please wait...' : title }}
        </button>
        <button class="button button-light right" @click.prevent="cancel">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import userAPI from '../../api/user.js'

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
          roles: []
        }
      }
    },
    created () {
      this.setup()
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/currentUser',
        isSuperAdmin: 'auth/isSuperAdmin',
        createRules: 'users/createRules',
        editRules: 'users/editRules'
      }),
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
    methods: {
      ...mapActions({
        syncCurrentUser: 'auth/syncCurrentUser',
        fetchUsers: 'users/fetch'
      }),
      setup () {
        // Set up the form. In this method we'll do two things:
        // 1) Take care of specific data fields (titles, etc.)
        // 2) Set the form fields array

        if (this.action === 'create') {
          this.title = 'Add User'
          this.rules = this.createRules
        }
        else {
          this.form = JSON.parse(JSON.stringify(this.user))
          this.rules = this.editRules
        }

        // Set up basic form fields to avoid code repetition
        this.formFields = [
          { label: 'Username', type: 'text', model: 'authKey' },
          { label: 'Password', type: 'password', model: 'password' },
          { label: 'Email', type: 'email', model: 'emailAddress' },
          { label: 'Display Name', type: 'text', model: 'fullName' }
        ]
      },
      submit () {
        this.formError = null
        this.errors.clear()

        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
          } else {
            // Disable form while HTTP request being made
            this.formDisable = true

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
            this.$toasted.error(this.$i18n.t('USER_UPDATE_ERROR'))
            this.dealWithErrors(err)
          }
        })
      },
      update () {
        if (this.user) {
          userAPI.edit({
            data: this.form,
            success: (response) => {
              // Update user in store if user updating themselves
              if (this.form.id === this.currentUser.id) {
                this.syncCurrentUser({ self: this })
              }

              this.dealWithSuccess(response)
            },
            fail: (err) => {
              this.$toasted.error(this.$i18n.t('USER_UPDATE_ERROR'))
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
        this.formError = null
        this.fetchUsers()
        this.reset()
        this.$router.push({ name: 'users' })
      },
      dealWithErrors (err) {
        // Here otherwise $validator won't allow you to act on disabled inputs
        this.formDisable = false

        // Get first error key to display main error msg
        for (let errorKey in err.errors) {
          if (err.errors.hasOwnProperty(errorKey)) {
            this.formError = this.$i18n.t(`errors.${errorKey}`)
            break // Only want the first element key
          }
        }

        // Inject errors into form fields
        for (let inputName in err.fields) {
          if (err.fields.hasOwnProperty(inputName)) {
            let inputErrors = err.fields[inputName]

            for (let errorKey in inputErrors) {
              if (inputErrors.hasOwnProperty(errorKey)) {
                this.$validator.errors.add(inputName, this.$i18n.t(`errors.${errorKey}`, null, { x: inputErrors[errorKey] }))
              }
            }
          }
        }
      },
      reset () {
        Object.assign(this.$data, this.$options.data.call(this))
      }
    }
  }
</script>
