<template>
  <div>
    <div>
      <h2>
        2FA Page
      </h2>
    </div>

    <div class="container">
      <div class="card">
        <h4 class="h4">
          Enter your 2FA code
        </h4>

        <div v-if="error.solveTwoFactorAuthenticationChallenge">
          <span class="error">{{ error.solveTwoFactorAuthenticationChallenge._data.message }}</span>
        </div>

        <div>
          <input
            v-model="tfaCode"
            type="text"
            class="input"
            placeholder="Email 2FA code"
            name="code"
          >
          <NuxtLink to="/login">
            Back to login
          </NuxtLink>
        </div>

        <div>
          <button
            class="btn"
            @click="process2FA"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['fortify:guest'],
})

const {
  error,
  solveTwoFactorAuthenticationChallenge,
} = useFortifyFeatures()

const tfaCode = ref(null)

const process2FA = async () => {
  try {
    await solveTwoFactorAuthenticationChallenge({ code: tfaCode.value })

    return navigateTo('/dashboard')
  }
  catch (error) {
    console.log(error)
  }
}
</script>
