<template>
  <div>
    <template>
      <top :title="`${$i18n.t('misc.SPECTERO')} ${$i18n.t('misc.PRO')}`"/>
      <loading v-if="loading"/>
      <div v-else>
        <div class="container pb-0">
          <div class="col-12">
            <div class="pro-marketing-cta section padded mb-0">
              <h2 class="mb-2">Upgrade to Spectero Pro</h2>
              <p class="cta sub">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet lorem convallis, sollicitudin mauris in, lacinia ipsum. Nunc bibendum lorem a augue lobortis pharetra.</p>
              <div class="features container pb-0">
                <div class="col-4">
                  <p class="icon-globe"/>
                  <h3>Global VPN Access</h3>
                  <p class="sub">Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                </div>
                <div class="col-4">
                  <p class="icon-bar-chart"/>
                  <h3>Ultra Fast Servers</h3>
                  <p class="sub">Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                </div>
                <div class="col-4">
                  <p class="icon-zap"/>
                  <h3>Premium Features</h3>
                  <p class="sub">Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="col-8">
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
                  <p class="price-warning">All prices are listed in <strong>USD</strong>.</p>
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

          <div class="col-4">
            <div class="section padded">
              <h3 class="mb-2">Spectero Pro Includes</h3>
              <p class="sub mb-2">Enjoy fully featured VPN services with Spectero Pro.</p>
              <ul class="checkmark">
                <li>24/7 customer support</li>
                <li>Ultra fast servers in 94 countries</li>
                <li>Best-in-class security &amp; encryption</li>
                <li>No activity logs &amp; no connection logs</li>
                <li>30 Days Risk Free. Not satisfied? Get your money back, no questions asked.</li>
              </ul>
            </div>
            <div class="section padded">
              <h3 class="mb-2">VPN Locations</h3>
              <p class="sub mb-2">Choose from 17 cities in 9 countries. With unlimited speeds and unlimited server switches, you can connect from anywhere in the world.</p>
              <ul class="list vpn-country-list">
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="US"/>
                    United States
                  </p>
                  <ul>
                    <li>Los Angeles, CA</li>
                    <li>San Francisco, CA</li>
                    <li>San Jose, CA</li>
                    <li>Atlanta, GA</li>
                    <li>New York, NY</li>
                    <li>Newark, NJ</li>
                    <li>Dallas, TX</li>
                    <li>Washington, VA</li>
                    <li>Seattle, WA</li>
                  </ul>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="CA"/>
                    Toronto, Canada
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="DE"/>
                    Frankfurt, Germany
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="GB"/>
                    London, United Kingdom
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="SG"/>
                    Singapore City, Singapore
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="IN"/>
                    Bengaluru, India
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="JP"/>
                    Tokyo, Japan
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="ZA"/>
                    Johannesburg, South Africa
                  </p>
                </li>
                <li>
                  <p>
                    <flag
                      :squared="false"
                      iso="TW"/>
                    Taipei, Taiwan
                  </p>
                </li>
              </ul>
            </div>
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
  .price-warning {
    margin-top: 12px;
    font-size: 90%;
    opacity: 0.6;
  }
}
.already-pro {
  text-align: center;

  [class^="icon-"] {
    font-size: 56px;
    color: $color-success;
  }
}
.pro-marketing-cta {
  h2 {
    font-size: 180%;
    font-weight: $font-bold;
    text-align: center;
  }
  .cta {
    text-align: center;
  }
  .features {
    text-align: center;

    [class^="icon-"] {
      margin-bottom: 20px;
      font-size: 48px;
      opacity: 0.8;
    }
    h3 {
      margin-bottom: 12px;
    }
  }
}
.vpn-country-list {
  .flag-icon {
    margin-right: 4px;
    position: relative;
    top: -1px;
  }
  > li {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
