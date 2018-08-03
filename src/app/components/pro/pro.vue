<template>
  <div>
    <template>
      <top :title="`${ (!isPro) ? `${$i18n.t('misc.PURCHASE')} `: '' }${$i18n.t('misc.SPECTERO')} ${$i18n.t('misc.PRO')}`"/>
      <loading v-if="loading"/>
      <div v-else>
        <div class="container">
          <div class="col-12">
            <div
              v-if="isPro"
              class="already-pro section padded">
              <div class="icon-check-circle mb-3"/>
              <h3>{{ $i18n.t('pro.ALREADY_SUBSCRIBED') }}</h3>
              <p>{{ $i18n.t('pro.ALREADY_SUBSCRIBED_TEXT') }}</p>
            </div>

            <form v-else>
              <div
                v-if="formError"
                class="message message-error">{{ formError }}</div>

              <template v-if="planFetched">
                <div class="step section padded select-plan">
                  <div class="step-1">
                    <div class="details">
                      <h5>Select your plan</h5>
                      <p>Please select the billing term you'd like to subscribe to.</p>
                    </div>
                  </div>
                  <div class="plans">
                    <article
                      v-for="(plan, id) in plans"
                      :key="id"
                      :class="{
                        'active': selectedPlan === id,
                        'best-deal': plan.bestDeal
                      }"
                      class="plan"
                      @click.stop="selectPlan(id)">
                      <div
                        v-if="plan.bestDeal"
                        class="most-popular-badge">
                        Most Popular
                      </div>
                      <div class="name">{{ plan.name }}</div>
                      <div class="amount">
                        <div
                          v-if="plan.oldPrice"
                          class="price old">
                          {{ plan.oldPrice | currency }}
                        </div>
                        <div class="price">{{ plan.price | currency }}</div>
                        <div class="per">per {{ plan.termLabel }}</div>
                      </div>
                      <div class="billing-terms">
                        <p>Billed {{ plan.price | currency }} every {{ plan.termLabel }}</p>
                      </div>
                      <div
                        v-if="plan.discountPercent"
                        class="savings">
                        Save {{ plan.discountPercent }}%
                      </div>
                    </article>
                  </div>
                </div>

                <div
                  v-if="!user"
                  class="step section padded">
                  <div class="step-2">
                    <div class="details">
                      <h5>Enter your email address</h5>
                      <p>We'll create an account associated to this email and send your order details here. We hate spam as much as you do.</p>
                    </div>
                  </div>
                  <div class="form-input mb-0">
                    <float-label>
                      <input
                        v-validate="'required|email'"
                        v-model="email"
                        :class="{'input-error': errors.has('email')}"
                        :disabled="formLoading"
                        type="email"
                        name="email"
                        class="input"
                        placeholder="Your email address"
                        data-vv-as="email"
                        @keyup="$validator.errors.removeById('email_FIELD_UNIQUE')">
                    </float-label>

                    <span
                      v-show="errors.has('email')"
                      class="input-error-message"
                      v-html="errors.first('email')"/>
                  </div>
                  <div class="captcha mt-3">
                    <vue-recaptcha
                      ref="recaptcha"
                      :sitekey="recaptchaSitekey"
                      @verify="captchaVerify"
                      @expired="captchaExpiry"/>
                  </div>
                </div>

                <div class="step section padded">
                  <div :class="`step-${ (user) ? 2 : 3 }`">
                    <div class="details">
                      <h5>Continue to payment</h5>
                      <p>Once you've selected your plan<template v-if="!user"> and entered your email</template>, click to continue below.</p>
                    </div>
                  </div>
                  <div>
                    <button
                      :class="{ 'button-loading': formLoading }"
                      :disabled="formLoading"
                      class="button-info button-md"
                      @click.prevent="submit"
                      @keyup.enter="submit">
                      <span class="icon-check"/> {{ $i18n.t('misc.CONTINUE') }}
                    </button>
                  </div>
                </div>
              </template>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import orderAPI from '@/app/api/order'
import marketAPI from '@/app/api/market'
import auth from '@/app/api/auth'
import top from '@/shared/components/top'
import VueRecaptcha from 'vue-recaptcha'
import loading from '@/shared/components/loading'

export default {
  components: {
    top,
    VueRecaptcha,
    loading
  },
  metaInfo: {
    title: 'Spectero Pro'
  },
  data () {
    return {
      email: null,
      formError: null,
      formLoading: false,
      plan: null,
      resource: null,
      selectedPlan: 'yearly',
      planFetched: false,
      plans: {
        monthly: {
          name: '1 Month',
          price: 0,
          termLabel: 'month'
        },
        yearly: {
          name: '1 Year',
          price: 0,
          termLabel: 'year',
          bestDeal: true
        }
      },
      captchaKey: null,
      captchaExpired: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      isPro: 'appAuth/isPro'
    }),
    recaptchaSitekey () {
      return process.env.GOOGLE_RECAPTCHA_KEY
    }
  },
  async created () {
    await this.syncCurrentUser()
    await this.fetchProPlan()
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    selectPlan (id) {
      this.selectedPlan = id
    },
    async fetchProPlan () {
      this.loading = true
      this.formError = null

      await orderAPI.plan({
        data: {
          id: 'pro'
        },
        success: async response => {
          const result = response.data.result

          this.loading = false
          this.planFetched = true
          this.plan = result
          this.resource = result.resources[0]

          result.price = parseFloat(this.resource.price)

          this.plans.monthly.price = result.price
          this.plans.yearly.price = (result.price / 30) * 365

          // Apply discount to yearly plan
          if (this.plan.yearly_discount_pct > 0) {
            const yearlyPlan = this.plans.yearly
            let yearlySavings = yearlyPlan.price * this.plan.yearly_discount_pct

            this.plans.yearly.oldPrice = yearlyPlan.price
            this.plans.yearly.price = Math.floor(yearlyPlan.price - yearlySavings) // floor the price for marketing purposes
            this.plans.yearly.discountPercent = this.plan.yearly_discount_pct * 100
          }
        },
        fail: error => {
          this.loading = false
          this.formError = this.$i18n.t('misc.UNKNOWN_ERROR')
          console.error('Error while getting pro plan', error)
        }
      })
    },
    async submit () {
      if (!this.user) {
        await this.easyRegister()
      } else {
        await this.createProOrder()
      }
    },
    createProOrder () {
      this.loading = true
      this.formError = null

      marketAPI.order({
        data: {
          items: [{
            id: this.plan.resources[0].id,
            type: this.plan.resources[0].type
          }],
          meta: {
            'term': (this.selectedPlan === 'yearly') ? 365 : 30
          }
        },
        success: response => {
          const result = response.data.result
          this.$router.push({ name: 'checkout', params: { id: result.last_invoice_id } })
        },
        fail: error => {
          this.loading = false
          this.formError = this.$i18n.t('pro.ORDER_CREATE_FAILED')
          console.error('Unable to create pro order', error)
        }
      })
    },
    easyRegister () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          // Check for captcha
          if (this.captchaExpired || !this.captchaKey) {
            this.formError = this.$i18n.t('errors.CAPTCHA_VALIDATION_FAILED')
          } else {
            // Disable form while HTTP request being made
            this.formLoading = true
            this.formError = null

            auth.registerEasy({
              data: {
                email: this.email
              },
              headers: {
                'X-CAPTCHA-RESPONSE': this.captchaKey
              },
              registerSuccess: async response => {
                await this.syncCurrentUser()

                this.formError = null
                this.createProOrder()
              },
              registerFailed: error => {
                this.easyRegisterError(error)
                console.error('Pro login failed', error)
              }
            })
          }
        }
      })
    },
    easyRegisterError (err) {
      this.formLoading = false

      // Reset captcha
      this.$refs.recaptcha.reset()
      this.captchaKey = null

      // Get first error key to display main error msg
      for (var errorKey in err.errors) {
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
    },
    captchaVerify: function (response) {
      this.captchaKey = response
      this.captchaExpired = false
    },
    captchaExpiry: function () {
      this.captchaKey = null
      this.captchaExpired = true
    }
  }
}
</script>

<style lang="scss" scoped>
.select-plan {
  .plans {
    display: flex;
    flex-direction: row;

    article {
      flex-basis: 100px;
      flex-grow: 1;
      margin-right: 12px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      text-align: center;
      background: $white;
      border: 4px solid $color-border;
      cursor: pointer;

      &.active {
        background: lighten($color-info, 54%);
        border-color: $color-info;
        cursor: default;
      }
      &.best-deal {
        .amount .price,
        .amount .per,
        .savings {
          color: $color-info;
        }
      }
      .name {
        margin-bottom: 14px;
        font-size: 22px;
        line-height: 100%;
        font-weight: $font-bold;
      }
      .amount {
        .price {
          font-size: 38px;
          line-height: 110%;
          font-weight: $font-bold;
          color: lighten($color-primary, 45%);

          &.old {
            margin-bottom: 4px;
            font-size: 20px;
            text-decoration: line-through;
            color: lighten($color-primary, 75%);
            font-weight: $font-semi;
          }
        }
        .per {
          font-size: 13px;
          line-height: 100%;
        }
      }
      .billing-terms {
        margin-top: 18px;
        padding-top: 16px;
        color: lighten($color-primary, 45%);
        border-top: 1px solid $color-border;
      }
      .savings {
        margin-top: 8px;
        font-size: 20px;
        line-height: 100%;
        font-weight: $font-bold;
      }
      .most-popular-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 5px 5px 3px 5px;
        color: $white;
        font-size: 12px;
        line-height: 100%;
        font-weight: $font-bold;
        text-transform: uppercase;
        background: $color-info;
        border-radius: 3px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.already-pro {
  text-align: center;

  [class^="icon-"] {
    font-size: 56px;
    color: $color-success;
  }
}
</style>
