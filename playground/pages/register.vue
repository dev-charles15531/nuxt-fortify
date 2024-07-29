<template>
  <div>
    <div>
      <h2>
        Register Page
      </h2>
    </div>
    <div class="container">
      <div class="card">
        <h4 class="h4">
          Enter your details to register
        </h4>

        <div v-if="error.register">
          <span class="error">{{ error.register._data.message }}</span>
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
            v-model="form.name"
            type="text"
            class="input"
            placeholder="Full name"
            name="name"
          >
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="Email address"
            name="email"
          >
          <input
            v-model="form.password"
            type="password"
            class="input"
            placeholder="Pasword"
          >
          <input
            v-model="form.password_confirmation"
            type="password"
            class="input"
            placeholder="Confirm Pasword"
          >
        </div>

        <div>
          <button
            class="btn"
            @click="processRegister"
          >
            Register
          </button>

          <div class="pt-5">
            <NuxtLink to="/login">
              Already have an account? Login
            </NuxtLink>
          </div>
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
  firstname: null,
  lastname: null,
  email: null,
  phone: null,
  password: null,
  password_confirmation: null,
})
const successMssg = ref('')

const { error, register } = useFortifyFeatures()

const resetForm = () => {
  form.value.firstname = null
  form.value.lastname = null
  form.value.email = null
  form.value.phone = null
  form.value.password = null
  form.value.password_confirmation = null
}

const processRegister = async () => {
  successMssg.value = ''

  try {
    await register(form.value)

    resetForm()

    successMssg.value = 'Registered successfully'
  }
  catch (error) {
    console.log(error)
  }
}
</script>
