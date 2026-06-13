<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from '~/components/auth/LoginForm.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
</script>
