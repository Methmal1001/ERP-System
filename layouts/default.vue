<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <AppHeader />
      <main class="flex-1">
        <slot />
      </main>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup>
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import ToastContainer from '~/components/ui/ToastContainer.vue'
</script>
