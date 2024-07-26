<template>
  <!-- <div>
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
  </div> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
