<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Role' : 'New Role' }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ isEdit ? 'Update role details' : 'Create a new user role' }}</p>
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
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Role Name *</label>
                <input v-model="form.name" type="text" required class="input" placeholder="e.g. HR Manager" />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Describe the responsibilities of this role..."
                  class="input resize-none"
                ></textarea>
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
                {{ loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Role' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  role: { type: Object, default: null },
})

const emit = defineEmits(['close', 'success'])

const permissionsStore = usePermissionsStore()

const isEdit = computed(() => !!props.role)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: props.role?.name ?? '',
  description: props.role?.description ?? '',
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const payload = {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
  }

  const result = isEdit.value
    ? await permissionsStore.updateRole(props.role.id, payload)
    : await permissionsStore.createRole(payload)

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
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
