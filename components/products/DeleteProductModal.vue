<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
        @click="!loading && $emit('close')"
      ></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <!-- Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start gap-4 mb-4">
              <div
                class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-6 h-6 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Delete Product</h2>
                <p class="text-sm text-gray-400 mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <div class="bg-red-50 border border-red-100 rounded-xl p-3.5">
              <p class="text-sm text-gray-600 leading-relaxed">
                You are about to permanently delete
                <span class="font-semibold text-red-700">{{ product.name }}</span>.
                All associated data will be removed from the system.
              </p>
            </div>
          </div>

          <!-- Form -->
          <div class="px-6 pb-4">
            <div
              v-if="formError"
              class="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2"
            >
              {{ formError }}
            </div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">
              Deletion Reason <span class="text-red-400">*</span>
            </label>
            <textarea
              v-model="reason"
              rows="3"
              placeholder="Explain why this product is being deleted..."
              class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors resize-none"
            ></textarea>
            <p class="text-xs text-gray-400 mt-1">
              {{ reason.trim().length }} characters
            </p>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="$emit('close')"
              :disabled="loading"
              class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="loading || !reason.trim()"
              class="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              {{ loading ? 'Deleting...' : 'Delete Product' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useProductsStore } from '~/stores/products/products'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['close', 'success'])

const store = useProductsStore()
const reason = ref('')
const loading = ref(false)
const formError = ref('')

const handleDelete = async () => {
  if (!reason.value.trim()) return
  formError.value = ''
  loading.value = true
  const result = await store.deleteProduct(props.product.id, reason.value.trim())
  loading.value = false
  if (result.success) {
    emit('success')
    emit('close')
  } else {
    formError.value = result.error || 'Failed to delete product. Please try again.'
  }
}
</script>
