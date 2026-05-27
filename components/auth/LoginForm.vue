<template>
  <div class="bg-white p-6 rounded shadow w-96">
    <h2 class="text-xl font-bold mb-4">Login</h2>

    <input v-model="username" placeholder="Username" class="input" />
    <input v-model="password" type="password" placeholder="Password" class="input" />

    <button
      class="bg-blue-600 text-white w-full mt-4 p-2 rounded"
      @click="login"
    >
      Login
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')

const auth = useAuthStore()
const router = useRouter()

const login = async () => {
  try {
    const res = await $fetch('https://localhost:5001/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    auth.setTokens(res.accessToken, res.refreshToken)

    router.push('/')
  } catch (err) {
    alert('Login failed')
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded mb-2;
}
</style>