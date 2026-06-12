<template>
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
      <div class="flex items-center gap-3 min-w-0">
        <button @click="sidebarOpen = true" class="lg:hidden text-gray-500 hover:text-gray-800 p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate">{{ pageTitle }}</h1>
          <p class="text-xs text-gray-400 truncate hidden sm:block">{{ pageSubtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-medium text-gray-500">{{ auth.user?.role ?? 'Guest' }}</span>
        </div>

        <!-- User menu -->
        <div class="relative">
          <button @click="menuOpen = !menuOpen" class="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {{ auth.initials }}
            </div>
            <svg class="w-4 h-4 text-gray-400 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition name="fade">
            <div
              v-if="menuOpen"
              v-click-outside="() => (menuOpen = false)"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40"
            >
              <div class="px-4 py-2 border-b border-gray-50">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ auth.user?.name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</p>
              </div>
              <div class="px-4 py-2">
                <p class="text-xs text-gray-400 mb-1">Permissions</p>
                <p class="text-xs font-medium text-gray-600">{{ auth.permissions.length }} granted</p>
              </div>
              <NuxtLink
                to="/account/change-password"
                @click="menuOpen = false"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Change Password
              </NuxtLink>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = useState('sidebar-open', () => false)
const menuOpen = ref(false)

const pageTitle = computed(() => route.meta?.title || 'Dashboard')
const pageSubtitle = computed(() => route.meta?.subtitle || '')

const handleLogout = async () => {
  menuOpen.value = false
  await auth.logout()
  router.push('/auth/Login')
}

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) binding.value(event)
    }
    setTimeout(() => document.addEventListener('click', el._clickOutside), 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
