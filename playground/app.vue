<template>
  <div>
    <br>
    <div>
      <input
        v-model="formData.firstname"
        type="text"
        placeholder="Firstname"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.lastname"
        type="text"
        placeholder="Lastname"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.email"
        type="email"
        placeholder="email"
        name="email"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.phone"
        type="text"
        placeholder="phone"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.password"
        type="password"
        placeholder="password"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.password_confirmation"
        type="password"
        placeholder="password confirmation"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.token"
        type="text"
        placeholder="token"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData.code"
        type="text"
        placeholder="code"
        name="code"
      >
    </div>
    <br>
    <div>
      <input
        v-model="formData1.recovery_code"
        type="text"
        placeholder="r-code"
        name="r-code"
      >
    </div>

    <br>

    <button @click="submit">
      Login
    </button>

    <div v-if="svg">
      {{ svg }}
    </div>
  </div>
</template>

<script setup>
const formData = ref({
  firstname: null,
  lastname: null,
  email: null,
  phone: null,
  password: null,
  password_confirmation: null,
  token: null,
  code: null,
})
const formData1 = ref({
  recovery_code: null,
})
const {
  login,
  isAuth,
  enableTwoFactorAuthentication,
  getTwoFactorAuthenticationQRCode,
  showTwoFactorAuthenticationRecoveryCodes,
  solveTwoFactorAuthenticationChallenge,
  disableTwoFactorAuthentication,
  register,
  resendEmailVerification,
  resetPassword,
  updatePassword,
  confirmPassword,
} = useFortifyFeatures()

const svg = ref(null)

const submit = async () => {
  console.log(isAuth.value)
  // await login(formData.value)
  // enableTwoFactorAuthentication()
  // getTwoFactorAuthenticationQRCode();  PASSED
  // svg.value = await showTwoFactorAuthenticationRecoveryCodes();  PASSED
  // svg.value = await solveTwoFactorAuthenticationChallenge(formData1.value);  PASSED
  // disableTwoFactorAuthentication()
  // await register(formData.value);  PASSED
  // await resendEmailVerification()
  // await resetPassword(formData.value.email); PASSED
  // await updatePassword(formData.value);  PASSED
  await confirmPassword(formData.value.password)
}
</script>
