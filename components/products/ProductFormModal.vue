<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
        @click="!loading && $emit('close')"
      ></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                {{ isEdit ? 'Edit Product' : 'Add New Product' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">
                {{
                  isEdit
                    ? 'Update the product information below'
                    : 'Fill in the details to create a new product'
                }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              :disabled="loading"
              class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Error Banner -->
          <div
            v-if="formError"
            class="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2"
          >
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ formError }}
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <!-- Basic Information -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                Basic Information
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Product Name <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="e.g. Mari Biscuits"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">SKU <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.sku"
                    type="text"
                    required
                    placeholder="e.g. PROD-001"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Category ID <span class="text-red-400">*</span></label>
                  <input
                    v-model="form.categoryId"
                    type="text"
                    required
                    placeholder="Category UUID"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="2"
                    placeholder="Product description..."
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                Pricing
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Unit Cost (Rs.) <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.unitCost"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Unit Price (Rs.) <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.unitPrice"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Unit of Measure <span class="text-red-400">*</span></label>
                  <select
                    v-model="form.unitOfMeasure"
                    required
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors bg-white"
                  >
                    <option value="Each">Each</option>
                    <option value="Box">Box</option>
                    <option value="Kg">Kg</option>
                    <option value="Litre">Litre</option>
                    <option value="Pack">Pack</option>
                    <option value="Dozen">Dozen</option>
                    <option value="Piece">Piece</option>
                  </select>
                </div>
              </div>
              <!-- Live margin preview -->
              <div
                v-if="form.unitCost > 0 && form.unitPrice > 0"
                class="mt-2.5 flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2"
              >
                <span class="text-xs text-gray-400">Estimated margin:</span>
                <span :class="previewMarginTextClass" class="text-xs font-bold">{{ previewMargin }}%</span>
                <span class="text-xs text-gray-400">— Profit: Rs. {{ (form.unitPrice - form.unitCost).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Stock Levels -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                Stock Configuration
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Min Stock <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.minStockLevel"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Reorder At <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.reorderPoint"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Reorder Qty <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.reorderQuantity"
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Max Stock <span class="text-red-400">*</span></label>
                  <input
                    v-model.number="form.maxStockLevel"
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">4</span>
                Additional Information
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Barcode</label>
                  <input
                    v-model="form.barcode"
                    type="text"
                    placeholder="e.g. 1234567890123"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Supplier ID</label>
                  <input
                    v-model="form.supplierId"
                    type="text"
                    placeholder="Supplier UUID (optional)"
                    class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-gray-100 pt-4"
          >
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 order-last sm:order-first"
            >
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="loading"
              class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-2"
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
              {{ loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useProductsStore } from '~/stores/products/products'

const props = defineProps({
  product: { type: Object, default: null }
})

const emit = defineEmits(['close', 'success'])

const store = useProductsStore()
const loading = ref(false)
const formError = ref('')
const isEdit = computed(() => !!props.product)

const buildForm = () => ({
  sku: props.product?.sku ?? '',
  name: props.product?.name ?? '',
  description: props.product?.description ?? '',
  categoryId: props.product?.categoryId ?? '',
  supplierId: props.product?.supplierId ?? null,
  unitCost: props.product?.unitCost ?? 0,
  unitPrice: props.product?.unitPrice ?? 0,
  unitOfMeasure: props.product?.unitOfMeasure ?? 'Each',
  reorderPoint: props.product?.reorderPoint ?? 0,
  reorderQuantity: props.product?.reorderQuantity ?? 0,
  minStockLevel: props.product?.minStockLevel ?? 0,
  maxStockLevel: props.product?.maxStockLevel ?? 0,
  barcode: props.product?.barcode ?? '',
  imageUrl: props.product?.imageUrl ?? null,
})

const form = reactive(buildForm())

const previewMargin = computed(() => {
  if (form.unitCost <= 0) return '0.0'
  return (((form.unitPrice - form.unitCost) / form.unitCost) * 100).toFixed(1)
})

const previewMarginTextClass = computed(() => {
  const m = parseFloat(previewMargin.value)
  if (m >= 30) return 'text-emerald-600'
  if (m >= 10) return 'text-amber-600'
  return 'text-red-500'
})

const handleSubmit = async () => {
  formError.value = ''
  if (!form.name.trim() || !form.sku.trim() || !form.categoryId.trim()) {
    formError.value = 'Please fill in all required fields.'
    return
  }
  loading.value = true
  const result = isEdit.value && props.product
    ? await store.updateProduct({ ...props.product, ...form })
    : await store.addProduct(form)
  loading.value = false
  if (result.success) {
    emit('success')
    emit('close')
  } else {
    formError.value = result.error || 'Operation failed. Please try again.'
  }
}
</script>
