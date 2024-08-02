<template>
  <div>
    <div>
      <h2>
        Dashboard Page
      </h2>
    </div>
    <div class="container">
      <div
        class="card"
      >
        <div>
          <h4 class="h4">
            User Details
          </h4>

          <div
            v-if="user"
            class="list-container"
          >
            <div
              v-for="(value, key, index) in user"
              :key="index"
              class="list-item"
            >
              {{ `${key}: ` }}
              <small>
                {{ `${value}` }}
              </small>
            </div>
          </div>
        </div>

        <div
          v-if="successMssg"
          class="pt-5"
        >
          <h6 style="color: green;">
            {{ successMssg }}
          </h6>
        </div>

        <div
          v-if="errorMssg"
          class="pt-5"
        >
          <h6 style="color: red;">
            {{ errorMssg }}
          </h6>
        </div>

        <div
          v-if="tfaSetupCode"
          class="pt-5"
        >
          <div v-html="tfaSetupCode" />
        </div>

        <div
          v-if="tfaRecoveryCode"
          class="pt-5"
        >
          <ul>
            <li
              v-for="(code, index) in tfaRecoveryCode"
              :key="index"
            >
              {{ code }}
            </li>
          </ul>
        </div>

        <div
          v-if="isConfirm2FAPanelOpen"
          class="pt-2"
        >
          <h5>Confirm 2FA code</h5>
          <input
            v-model="tfaConfirmCode"
            type="text"
            class="input"
            placeholder="Enter 2FA confirm code"
          >
          <button
            class="btn"
            @click="processConfirmTwoFactorAuthentication"
          >
            Submit
          </button>
        </div>

        <div
          v-if="isConfirmPasswordPanelOpen"
          class="pt-2"
        >
          <h5>Confirm Password</h5>
          <input
            v-model="password"
            type="password"
            class="input"
            placeholder="Enter your password"
          >
          <button
            class="btn"
            @click="processConfirmPassword"
          >
            Submit
          </button>
        </div>

        <div class="pt-2 btn-grid">
          <button
            v-for="(btnAction, index) in actionButtons"
            :key="index"
            class="btn"
            @click="btnAction.func"
          >
            {{ btnAction.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['fortify:auth'],
})
const { user } = useFortifyUser()
const {
  logout,
  enableTwoFactorAuthentication,
  confirmTwoFactorAuthentication,
  getTwoFactorAuthenticationQRCode,
  showTwoFactorAuthenticationRecoveryCodes,
  disableTwoFactorAuthentication,
  resendEmailVerification,
  confirmPassword,
} = useFortifyFeatures()
const successMssg = ref('')
const errorMssg = ref('')
const isConfirm2FAPanelOpen = ref(false)
const isConfirmPasswordPanelOpen = ref(false)
const tfaConfirmCode = ref(null)
const tfaSetupCode = ref(null)
const password = ref(null)
const tfaRecoveryCode = ref(null)

const resetMssg = () => {
  successMssg.value = errorMssg.value = ''
}

const processLogout = async () => {
  await logout()
}

const processEnableTwoFactorAuthentication = async () => {
  resetMssg()

  try {
    await enableTwoFactorAuthentication()

    successMssg.value = '2FA Enabled'
  }
  catch (error) {
    errorMssg.value = 'Unable to Enable 2FA'
  }
}

const processConfirmTwoFactorAuthentication = async () => {
  resetMssg()

  try {
    await confirmTwoFactorAuthentication({ code: tfaConfirmCode.value })

    successMssg.value = '2FA Confirmed'
  }
  catch (error) {
    errorMssg.value = 'Unable to Confirm 2FA'
  }
}

const getTwoFactorAuthenticationSetupCode = async () => {
  resetMssg()

  try {
    const response = tfaSetupCode.value ? null : await getTwoFactorAuthenticationQRCode()
    tfaSetupCode.value = tfaSetupCode.value ? null : response.svg

    successMssg.value = tfaRecoveryCode.value ? '2FA setup code below' : ''
  }
  catch (error) {
    errorMssg.value = 'Unable to retrive 2FA setup code'
    console.log(error)
  }
}

const processDisableTwoFactorAuthentication = async () => {
  resetMssg()

  try {
    await disableTwoFactorAuthentication()

    successMssg.value = '2FA Disabled'
  }
  catch (error) {
    errorMssg.value = 'Unable to Disable 2FA'
  }
}

const processShow2FARecoveryCode = async () => {
  resetMssg()

  try {
    tfaRecoveryCode.value = tfaRecoveryCode.value ? null : await showTwoFactorAuthenticationRecoveryCodes()

    successMssg.value = tfaRecoveryCode.value ? '2FA recovery code:' : ''
  }
  catch (error) {
    errorMssg.value = 'Unable to Disable 2FA'
  }
}

const processResendEmailVerification = async () => {
  resetMssg()

  try {
    await resendEmailVerification()

    successMssg.value = 'Email sent successfully'
  }
  catch (error) {
    errorMssg.value = 'Unable to resend email verification'
    console.log(error)
  }
}

const processConfirmPassword = async () => {
  resetMssg()

  try {
    await confirmPassword(password.value)

    successMssg.value = 'Password Confirmed'
  }
  catch (error) {
    errorMssg.value = 'Unable to Confirm password'
  }
}

const toggleConfirm2FAPanel = () => {
  isConfirm2FAPanelOpen.value = !isConfirm2FAPanelOpen.value
}

const toggleConfirmPasswordPanel = () => {
  isConfirmPasswordPanelOpen.value = !isConfirmPasswordPanelOpen.value
}

const actionButtons = ref([
  {
    name: 'Enable 2FA',
    func: processEnableTwoFactorAuthentication,
  },
  {
    name: 'Show 2FA setup code',
    func: getTwoFactorAuthenticationSetupCode,
  },
  {
    name: 'Confirm 2FA',
    func: toggleConfirm2FAPanel,
  },
  {
    name: 'Show 2FA recov. code',
    func: processShow2FARecoveryCode,
  },
  {
    name: 'Disable 2FA',
    func: processDisableTwoFactorAuthentication,
  },
  {
    name: 'Confirm password',
    func: toggleConfirmPasswordPanel,
  },
  {
    name: 'Resend email verification',
    func: processResendEmailVerification,
  },
  {
    name: '',
    func: null,
  },
  {
    name: 'Logout',
    func: processLogout,
  },
])
</script>

<style>
.list-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.pt-5{
  padding-top: 20px;
}

.pt-2{
  padding-top: 7px;
}

.list-item{
  word-wrap: break-word;
}

.btn-grid{
 display: grid;
 grid-template-columns: repeat(3, 1fr);
}
</style>
