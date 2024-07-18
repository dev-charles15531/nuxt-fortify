<template>
  <div>
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
      <input
        type="password"
        placeholder="password"
        v-model="formData.password"
      />
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
  email: null,
  password: null,
  code: null,
});
const formData1 = ref({
  recovery_code: null,
});
const {
  login,
  enableTwoFactorAuthentication,
  getTwoFactorAuthenticationQRCode,
  isAuth,
  showTwoFactorAuthenticationRecoveryCodes,
  solveTwoFactorAuthenticationChallenge,
  disableTwoFactorAuthentication,
} = useFortifyFeatures();

const user = useFortifyUser();
const svg = ref(null);

const submit = async () => {
  // await login(formData.value);
  console.log(isAuth.value);

  svg.value = await solveTwoFactorAuthenticationChallenge(formData1.value);
  // svg.value = await showTwoFactorAuthenticationRecoveryCodes();
  // disableTwoFactorAuthentication();
  // enableTwoFactorAuthentication();
};
</script>
