<template>
  <header class="bg-white shadow px-6 py-4 flex justify-between">
    <h1 class="font-bold text-blue-600">ERP System</h1>

    <button
      class="text-red-500"
      @click="logout"
    >
      Logout
    </button>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/authController/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/auth/login')
}
</script>