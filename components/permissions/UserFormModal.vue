<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit User' : 'New User' }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ isEdit ? 'Update user account details' : 'Create a new user account' }}</p>
              </div>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                <input v-model="form.name" type="text" required class="input" placeholder="Jane Doe" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Username *</label>
                <input v-model="form.username" type="text" required class="input" placeholder="jane.doe" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Employee No. *</label>
                <input v-model="form.empNo" type="text" required class="input" placeholder="EMP-0001" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                <input v-model="form.email" type="email" required class="input" placeholder="jane.doe@company.com" />
              </div>

              <div v-if="!isEdit">
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Password *</label>
                <input v-model="form.password" type="password" required minlength="6" class="input" placeholder="••••••••" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Role *</label>
                <select v-model="form.roleId" required class="input bg-white">
                  <option value="" disabled>Select role</option>
                  <option v-for="role in permissionsStore.roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                </select>
              </div>

              <div v-if="isEdit" class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">Active Account</p>
                  <p class="text-xs text-gray-400">Inactive users cannot sign in</p>
                </div>
                <button
                  type="button"
                  @click="form.isActive = !form.isActive"
                  :class="form.isActive ? 'bg-blue-600' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                >
                  <span :class="form.isActive ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                @click="$emit('close')"
                :disabled="loading"
                class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  user: { type: Object, default: null },
})
const emit = defineEmits(['close', 'success'])

const permissionsStore = usePermissionsStore()

const isEdit = computed(() => !!props.user)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: props.user?.name ?? '',
  username: props.user?.username ?? '',
  empNo: props.user?.employeeNo ?? '',
  email: props.user?.email ?? '',
  password: '',
  roleId: props.user?.roleId ?? '',
  isActive: props.user?.isActive ?? true,
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = isEdit.value
    ? await permissionsStore.updateUser(props.user.id, {
        name: form.name.trim(),
        username: form.username.trim(),
        empNo: form.empNo.trim(),
        email: form.email.trim(),
        roleId: form.roleId,
        isActive: form.isActive,
      })
    : await permissionsStore.createUser({
        name: form.name.trim(),
        username: form.username.trim(),
        empNo: form.empNo.trim(),
        email: form.email.trim(),
        password: form.password,
        roleId: form.roleId,
      })

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!permissionsStore.roles.length) permissionsStore.fetchRoles()
})
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
