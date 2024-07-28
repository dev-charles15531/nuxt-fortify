<template>
  <div>
    <div>
      <h2>
        Login Page
      </h2>
    </div>
    <div class="container">
      <div class="card">
        <h4 class="h4">
          Enter your login details
        </h4>

        <div v-if="error.login">
          <span class="error">{{ error.login._data.message }}</span>
        </div>

        <div>
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

          <NuxtLink to="/forgot-password">
            Forgot password
          </NuxtLink>
        </div>

        <div>
          <button
            class="btn"
            @click="processLogin"
          >
            Login
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
  password: null,
})

const { error, login } = useFortifyFeatures()

const processLogin = async () => {
  await login(form.value)
}
</script>

<style>
.container{
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card{
    width: 40%;
    min-height: 240px;
    background-color: ghostwhite;
    box-shadow: 1px;
    padding: 10px 33px 12px 33px;
    border-radius: 2%;
}

.h4{
    color: darkslategray;
}

.input{
    height: 28px;
    width: 95%;
    margin-top: 10px;
    padding: 5px 10px;
}

.btn{
    margin-top: 40px;
    padding: 10px 33px 8px 33px;
    cursor: pointer;
}

.error{
    color: rgb(209, 49, 49);
}
</style>
