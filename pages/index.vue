<template>
  <div>
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p>Welcome to Test System 🚀</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>