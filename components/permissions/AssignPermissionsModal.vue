<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Manage Permissions</h2>
              <p class="text-sm text-gray-400 mt-0.5">{{ role.name }}</p>
            </div>
            <button type="button" @click="$emit('close')" :disabled="loading" class="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ error }}
            </div>

            <div v-if="permissionsStore.loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>

            <div v-else-if="!permissionsStore.permissions.length" class="text-center py-10">
              <p class="text-sm text-gray-400">No permissions defined yet.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="(items, moduleName) in groupedPermissions" :key="moduleName" class="border border-gray-100 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-700">{{ moduleName }}</span>
                  <button type="button" @click="toggleModule(moduleName, items)" class="text-xs font-medium text-blue-600 hover:text-blue-700">
                    {{ isModuleFullySelected(items) ? 'Deselect all' : 'Select all' }}
                  </button>
                </div>
                <div class="divide-y divide-gray-50">
                  <label v-for="perm in items" :key="perm.id" class="flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50/60 transition-colors">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-700">{{ perm.action }}</p>
                      <p v-if="perm.description" class="text-xs text-gray-400 truncate">{{ perm.description }}</p>
                    </div>
                    <input
                      type="checkbox"
                      :checked="selectedIds.has(perm.id)"
                      @change="togglePermission(perm.id)"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                  </label>
                </div>
              </div>
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
              type="button"
              @click="handleSubmit"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Saving...' : 'Save Permissions' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  role: { type: Object, required: true },
})
const emit = defineEmits(['close', 'success'])

const permissionsStore = usePermissionsStore()

const loading = ref(false)
const error = ref('')

const selectedIds = ref(new Set(props.role.permissions ?? []))

const groupedPermissions = computed(() => {
  const groups = {}
  for (const perm of permissionsStore.permissions) {
    if (!groups[perm.module]) groups[perm.module] = []
    groups[perm.module].push(perm)
  }
  return groups
})

const togglePermission = (id) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

const isModuleFullySelected = (items) => items.every((p) => selectedIds.value.has(p.id))

const toggleModule = (moduleName, items) => {
  const next = new Set(selectedIds.value)
  if (isModuleFullySelected(items)) {
    items.forEach((p) => next.delete(p.id))
  } else {
    items.forEach((p) => next.add(p.id))
  }
  selectedIds.value = next
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = await permissionsStore.assignPermissions(props.role.id, Array.from(selectedIds.value))

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}

onMounted(() => {
  if (!permissionsStore.permissions.length) permissionsStore.fetchPermissions()
})
</script>
