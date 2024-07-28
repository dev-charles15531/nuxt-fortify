<template>
  <div>
    <div>
      <h2>
        Dashboard Page
      </h2>
    </div>
    <div class="container">
      <div
        class="card"
      >
        <div>
          <h4 class="h4">
            User Details
          </h4>

          <div
            v-if="hasUser"
            class="list-container"
          >
            <div
              v-for="(value, key, index) in user"
              :key="index"
              class="list-item"
            >
              {{ `${key}: ` }}
              <small>
                {{ `${value}` }}
              </small>
            </div>
          </div>
        </div>

        <div class="pt-5">
          <button
            class="btn"
            @click="processLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['fortify:auth'],
})
const { user } = useFortifyUser()
const { logout } = useFortifyFeatures()

const hasUser = computed(() => user.value !== null)

const processLogout = async () => {
  await logout()
}
</script>

<style scoped>
.list-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.pt-5{
  padding-top: 20px;
}

.list-item{
  word-wrap: break-word;
}
</style>
