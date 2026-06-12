<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="!loading && $emit('close')"></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <form @submit.prevent="handleSubmit">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Upload Document</h2>
                <p class="text-sm text-gray-400 mt-0.5">Add a document record for {{ employeeName }}</p>
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
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Document Type *</label>
                <select v-model="form.documentType" required class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors bg-white">
                  <option value="" disabled>Select type</option>
                  <option value="NationalID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Resume">Resume / CV</option>
                  <option value="Contract">Employment Contract</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">File Name *</label>
                <input
                  v-model="form.fileName"
                  type="text"
                  required
                  placeholder="e.g. passport-scan.pdf"
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">File URL *</label>
                <input
                  v-model="form.fileUrl"
                  type="text"
                  required
                  placeholder="https://..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Expiry Date</label>
                  <input
                    v-model="form.expiryDate"
                    type="date"
                    class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">Note</label>
                <textarea
                  v-model="form.note"
                  rows="2"
                  placeholder="Optional note about this document..."
                  class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors resize-none"
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
                {{ loading ? 'Uploading...' : 'Upload Document' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  employeeId: { type: String, required: true },
  employeeName: { type: String, default: '' },
})
const emit = defineEmits(['close', 'success'])

const employeesStore = useEmployeesStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  documentType: '',
  fileName: '',
  fileUrl: '',
  expiryDate: '',
  note: '',
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  const result = await employeesStore.uploadDocument({
    employeeId: props.employeeId,
    documentType: form.documentType,
    fileName: form.fileName.trim(),
    fileUrl: form.fileUrl.trim(),
    expiryDate: form.expiryDate || null,
    note: form.note.trim() || undefined,
  })

  loading.value = false

  if (result.success) {
    emit('success')
    emit('close')
  } else {
    error.value = result.error
  }
}
</script>
