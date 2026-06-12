<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Department' : 'New Department' }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ isEdit ? 'Update department details' : 'Create a new department' }}</p>
              </div>
              <button type="button" @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ error }}
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Department Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="e.g. Human Resources"
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Code</label>
                  <input
                    v-model="form.code"
                    type="text"
                    placeholder="e.g. HR"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors font-mono uppercase"
                  />
                </div>

                <div v-if="isEdit">
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                  <button
                    type="button"
                    @click="form.isActive = !form.isActive"
                    class="w-full flex items-center justify-between px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl transition-colors"
                    :class="form.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'"
                  >
                    <span class="font-medium">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
                    <span
                      class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                      :class="form.isActive ? 'bg-emerald-500' : 'bg-gray-300'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                        :class="form.isActive ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'"
                      ></span>
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Brief description of the department's purpose..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Department Manager</label>
                <select
                  v-model="form.managerId"
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors bg-white"
                >
                  <option value="">No manager assigned</option>
                  <option v-for="emp in employeeOptions" :key="emp.id" :value="emp.id">
                    {{ emp.fullName }} — {{ emp.jobTitle }}
                  </option>
                </select>
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
                {{ loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Department' }}
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
  department: { type: Object, default: null },
})
const emit = defineEmits(['close', 'success'])

const departmentsStore = useDepartmentsStore()
const employeesStore = useEmployeesStore()

const isEdit = computed(() => !!props.department)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: props.department?.name ?? '',
  code: props.department?.code ?? '',
  description: props.department?.description ?? '',
  managerId: props.department?.managerId ?? '',
  isActive: props.department?.isActive ?? true,
})

const employeeOptions = computed(() => employeesStore.employees)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const payload = {
    name: form.name.trim(),
    code: form.code.trim() || null,
    description: form.description.trim() || null,
    managerId: form.managerId || null,
  }

  const result = isEdit.value
    ? await departmentsStore.update(props.department.id, { ...payload, isActive: form.isActive })
    : await departmentsStore.create(payload)

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!employeesStore.employees.length) {
    employeesStore.fetchAll({ pageSize: 100 })
  }
})
</script>
