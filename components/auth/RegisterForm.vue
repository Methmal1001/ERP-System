<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
        <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 8v6m3-3h-6" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">{{ auth.isAuthenticated ? 'Create Admin Account' : 'Set Up Administrator' }}</h1>
      <p class="text-sm text-gray-400 mt-1">
        {{ auth.isAuthenticated ? 'Register another system administrator' : 'Register the first administrator for this workspace' }}
      </p>
    </div>

    <div v-if="error" class="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
      <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ error }}
    </div>

    <div v-if="success" class="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
      <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {{ success }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
        <input v-model="username" type="text" required class="input" placeholder="admin.user" autocomplete="username" />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Employee No.</label>
        <input v-model="empNo" type="text" required class="input" placeholder="EMP-0001" />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
        <input v-model="email" type="email" required class="input" placeholder="you@company.com" autocomplete="email" />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">NIC No.</label>
        <input v-model="nic" type="text" required minlength="8" class="input" placeholder="National Identity Card number" />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
        <input v-model="password" type="password" required minlength="8" class="input" placeholder="••••••••" autocomplete="new-password" />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
        <input v-model="confirmPassword" type="password" required minlength="8" class="input" placeholder="••••••••" autocomplete="new-password" />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        {{ loading ? 'Creating...' : 'Create Admin Account' }}
      </button>
    </form>

    <p v-if="!auth.isAuthenticated" class="text-center text-sm text-gray-400 mt-6">
      Already have an account?
      <NuxtLink to="/auth/Login" class="text-blue-600 font-semibold hover:text-blue-700">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const empNo = ref('')
const email = ref('')
const nic = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const resetForm = () => {
  username.value = ''
  empNo.value = ''
  email.value = ''
  nic.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  const result = await auth.register({
    username: username.value.trim(),
    empNo: empNo.value.trim(),
    email: email.value.trim(),
    nic: nic.value.trim(),
    password: password.value,
  })
  loading.value = false

  if (result.success) {
    if (auth.isAuthenticated) {
      success.value = 'Admin account created successfully.'
      toast.success('Admin account created successfully.')
      resetForm()
    } else {
      toast.success('Admin account created. Please sign in.')
      router.push('/auth/Login')
    }
  } else {
    error.value = result.error
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.75rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus {
  outline: none;
  border-color: rgb(96 165 250);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}
</style>
