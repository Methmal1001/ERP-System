<template>
  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:translate-x-0"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100 flex-shrink-0">
      <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
        </svg>
      </div>
      <div>
        <p class="font-bold text-gray-900 leading-tight">HR Suite</p>
        <p class="text-xs text-gray-400 leading-tight">ERP System</p>
      </div>
      <button @click="sidebarOpen = false" class="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Main</p>
      <NuxtLink
        v-for="item in mainItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
        :class="isActive(item.to)
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'"
        @click="sidebarOpen = false"
      >
        <span
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive(item.to) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'"
          v-html="item.icon"
        ></span>
        {{ item.label }}
      </NuxtLink>

      <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-5">Workforce</p>
      <NuxtLink
        v-for="item in workforceItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
        :class="isActive(item.to)
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'"
        @click="sidebarOpen = false"
      >
        <span
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive(item.to) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'"
          v-html="item.icon"
        ></span>
        {{ item.label }}
      </NuxtLink>

      <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-5">Inventory</p>
      <NuxtLink
        v-for="item in inventoryItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
        :class="isActive(item.to)
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'"
        @click="sidebarOpen = false"
      >
        <span
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive(item.to) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'"
          v-html="item.icon"
        ></span>
        {{ item.label }}
      </NuxtLink>

      <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-5">Administration</p>
      <NuxtLink
        v-for="item in adminItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
        :class="isActive(item.to)
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'"
        @click="sidebarOpen = false"
      >
        <span
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive(item.to) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'"
          v-html="item.icon"
        ></span>
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- User -->
    <div class="border-t border-gray-100 p-3 flex-shrink-0">
      <div class="flex items-center gap-3 px-2 py-2 rounded-xl">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {{ auth.initials }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-gray-800 truncate">{{ auth.user?.name ?? 'Guest' }}</p>
          <p class="text-xs text-gray-400 truncate">{{ auth.user?.role ?? '—' }}</p>
        </div>
        <button @click="handleLogout" title="Log out" class="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = useState('sidebar-open', () => false)

const icon = (path) => `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="${path}" /></svg>`

const mainItems = [
  { to: '/', label: 'Dashboard', icon: icon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6') },
]

const workforceItems = [
  { to: '/employees', label: 'Employees', icon: icon('M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4') },
  { to: '/departments', label: 'Departments', icon: icon('M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01') },
  { to: '/job-positions', label: 'Job Positions', icon: icon('M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v10a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5z') },
  { to: '/attendance', label: 'Attendance', icon: icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm6-7l2 2 4-4') },
  { to: '/leave', label: 'Leave', icon: icon('M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 16h.01M12 16h.01M15 16h.01') },
  { to: '/payroll', label: 'Payroll', icon: icon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  { to: '/performance', label: 'Performance', icon: icon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10m6 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14') },
]

const inventoryItems = [
  { to: '/products', label: 'Products', icon: icon('M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4') },
  { to: '/products/deleted', label: 'Deleted Products', icon: icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16') },
]

const adminItems = [
  { to: '/permissions', label: 'Roles & Permissions', icon: icon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v2') },
]

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/auth/Login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
