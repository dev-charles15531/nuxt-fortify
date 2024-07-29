<template>
  <div>
    <div>
      <h2>
        Forgot password Page
      </h2>
    </div>
    <div class="container">
      <div class="card">
        <h4 class="h4">
          Enter your email to get reset link
        </h4>

        <div v-if="error.resetPassword">
          <span class="error">{{ error.resetPassword._data.message }}</span>
        </div>
        <div
          v-if="successMssg"
          class="pt-5"
        >
          <h6 style="color: green;">
            {{ successMssg }}
          </h6>
        </div>

        <div>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="Email address"
            name="email"
          >
          <nuxt-link to="/login">
            back to login
          </nuxt-link>
        </div>

        <div>
          <button
            class="btn"
            @click="sendResetPasswordLink"
          >
            Send Link
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

const form = ref({
  email: null,
})
const successMssg = ref('')

const { error, resetPassword } = useFortifyFeatures()

const sendResetPasswordLink = async () => {
  successMssg.value = ''

  try {
    await resetPassword(form.value.email)

    successMssg.value = 'Link sent successfully'
  }
  catch (error) {
    console.log(error)
  }
}
</script>
