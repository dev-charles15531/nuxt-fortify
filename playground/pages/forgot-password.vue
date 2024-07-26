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

        <div v-if="error">
          <span class="error">{{ error._data.message }}</span>
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

const error = ref(null)

const { resetPassword } = useFortifyFeatures()

const sendResetPasswordLink = async () => {
  await resetPassword(form.value.email)
}
</script>
