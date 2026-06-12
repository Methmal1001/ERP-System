<template>
  <AccountAccessInfo />
</template>

<script setup>
import AccountAccessInfo from '~/components/auth/AccountAccessInfo.vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
</script>
