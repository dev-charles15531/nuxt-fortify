<template>
  <div>
    <br />
    <div>
      <input type="text" placeholder="Firstname" v-model="formData.firstname" />
    </div>
    <br />
    <div>
      <input type="text" placeholder="Lastname" v-model="formData.lastname" />
    </div>
    <br />
    <div>
      <input
        type="email"
        placeholder="email"
        name="email"
        v-model="formData.email"
      />
    </div>
    <br />
    <div>
      <input type="text" placeholder="phone" v-model="formData.phone" />
    </div>
    <br />
    <div>
      <input
        type="password"
        placeholder="password"
        v-model="formData.password"
      />
    </div>
    <br />
    <div>
      <input
        type="password"
        placeholder="password confirmation"
        v-model="formData.password_confirmation"
      />
    </div>
    <br />
    <div>
      <input type="text" placeholder="token" v-model="formData.token" />
    </div>
    <br />
    <div>
      <input
        type="text"
        placeholder="code"
        name="code"
        v-model="formData.code"
      />
    </div>
    <br />
    <div>
      <input
        type="text"
        placeholder="r-code"
        name="r-code"
        v-model="formData1.recovery_code"
      />
    </div>

    <br />

    <button @click="submit">Login</button>

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
});
const formData1 = ref({
  recovery_code: null,
});
const {
  login,
  isAuth,
  enableTwoFactorAuthentication,
  getTwoFactorAuthenticationQRCode,
  showTwoFactorAuthenticationRecoveryCodes,
  solveTwoFactorAuthenticationChallenge,
  disableTwoFactorAuthentication,
  register,
} = useFortifyFeatures();

const svg = ref(null);

const submit = async () => {
  // await login(formData.value); PASSED
  // enableTwoFactorAuthentication();     PASSED
  // getTwoFactorAuthenticationQRCode();  PASSED
  // svg.value = await showTwoFactorAuthenticationRecoveryCodes();  PASSED
  // svg.value = await solveTwoFactorAuthenticationChallenge(formData1.value);  PASSED
  // disableTwoFactorAuthentication();    PASSED
  await register(formData.value);
};
</script>
