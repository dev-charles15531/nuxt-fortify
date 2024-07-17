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

    <button @click="submit">Login</button>
  </div>
</template>

<script setup>
// import { useFortifyFeatures } from "#imports";

const formData = ref({
  email: null,
  password: null,
});
const { login } = useFortifyFeatures();

const submit = () => {
  console.log(formData.value);

  login(formData.value).then((response) => {
    console.log("logged in");
  });
};
</script>
