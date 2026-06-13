<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Job Position' : 'New Job Position' }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ isEdit ? 'Update position details' : 'Create a new job position' }}</p>
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
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Position Title *</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Department *</label>
                  <select
                    v-model="form.departmentId"
                    required
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors bg-white"
                  >
                    <option value="" disabled>Select department</option>
                    <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Level</label>
                  <select
                    v-model="form.level"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors bg-white"
                  >
                    <option value="">Not specified</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Minimum Salary</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input
                      v-model.number="form.minSalary"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Maximum Salary</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                    <input
                      v-model.number="form.maxSalary"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Brief description of the role and responsibilities..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors resize-none"
                ></textarea>
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
                {{ loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Position' }}
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
  position: { type: Object, default: null },
  defaultDepartmentId: { type: String, default: '' },
})
const emit = defineEmits(['close', 'success'])

const jobPositionsStore = useJobPositionsStore()
const departmentsStore = useDepartmentsStore()

const isEdit = computed(() => !!props.position)
const loading = ref(false)
const error = ref('')

const form = reactive({
  title: props.position?.title ?? '',
  departmentId: props.position?.departmentId ?? props.defaultDepartmentId ?? '',
  level: props.position?.level ?? '',
  minSalary: props.position?.minSalary ?? null,
  maxSalary: props.position?.maxSalary ?? null,
  description: props.position?.description ?? '',
  isActive: props.position?.isActive ?? true,
})

const handleSubmit = async () => {
  error.value = ''

  if (form.minSalary != null && form.maxSalary != null && form.maxSalary < form.minSalary) {
    error.value = 'Maximum salary cannot be less than minimum salary.'
    return
  }

  loading.value = true

  const payload = {
    title: form.title.trim(),
    departmentId: form.departmentId,
    level: form.level || null,
    minSalary: form.minSalary ?? 0,
    maxSalary: form.maxSalary ?? 0,
    description: form.description.trim() || null,
  }

  const result = isEdit.value
    ? await jobPositionsStore.update(props.position.id, { ...payload, isActive: form.isActive })
    : await jobPositionsStore.create(payload)

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!departmentsStore.departments.length) {
    departmentsStore.fetchAll()
  }
})
</script>
