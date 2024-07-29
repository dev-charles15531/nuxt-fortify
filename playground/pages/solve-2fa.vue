<template>
  <div>
    <div>
      <h2>
        Solve 2FA Page
      </h2>
    </div>
    <div class="container">
      <div class="card">
        <h4 class="h4">
          Enter your 2FA details
        </h4>

        <div v-if="error.solveTwoFactorAuthenticationChallenge">
          <span class="error">{{ error.solveTwoFactorAuthenticationChallenge._data.message }}</span>
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

        <div>
          <input
            v-model="tfaSolveCode"
            type="text"
            class="input"
            placeholder="Enter 2FA code to solve"
          >

          <NuxtLink to="/login">
            Back to login
          </NuxtLink>
        </div>

        <div>
          <button
            class="btn"
            @click="processSolveTwoFactorAuthentication"
          >
            Submit
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

const tfaSolveCode = ref(null)
const successMssg = ref('')
const errorMssg = ref('')

const { error, solveTwoFactorAuthenticationChallenge,
} = useFortifyFeatures()

const resetMssg = () => {
  successMssg.value = errorMssg.value = ''
}

const processSolveTwoFactorAuthentication = async () => {
  resetMssg()

  try {
    await solveTwoFactorAuthenticationChallenge({ recovery_code: tfaSolveCode.value })

    successMssg.value = '2FA Solved correct!'
  }
  catch (error) {
    errorMssg.value = 'Unable to solve 2FA'
  }
}
</script>
