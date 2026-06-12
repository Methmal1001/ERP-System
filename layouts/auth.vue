<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

    <div class="relative w-full max-w-md">
      <slot />
    </div>
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from '~/components/ui/ToastContainer.vue'
</script>
