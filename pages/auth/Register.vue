<template>
  <RegisterForm />
</template>

<script setup>
import RegisterForm from '~/components/auth/RegisterForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'register-access',
})
</script>
