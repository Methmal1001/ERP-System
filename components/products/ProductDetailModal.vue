<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <div class="relative min-h-full flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-6">
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div class="flex items-center gap-4 pr-10">
              <div
                class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white text-2xl font-bold">{{
                  product.name.charAt(0).toUpperCase()
                }}</span>
              </div>
              <div>
                <h2 class="text-white text-xl font-bold leading-tight">{{ product.name }}</h2>
                <p class="text-blue-200 text-sm font-mono mt-0.5">{{ product.sku }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="px-2 py-0.5 bg-white/20 text-white rounded-full text-xs">
                    {{ product.categoryName || 'Uncategorized' }}
                  </span>
                  <span
                    :class="
                      product.isActive
                        ? 'bg-green-400/30 text-green-100'
                        : 'bg-red-400/30 text-red-100'
                    "
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <!-- Description -->
            <div
              v-if="product.description"
              class="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                Description
              </p>
              <p class="text-sm text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Info + Pricing -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Product Details -->
              <div class="space-y-2">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Product Details
                </p>
                <div class="space-y-0">
                  <div
                    v-for="row in detailRows"
                    :key="row.label"
                    class="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
                  >
                    <span class="text-xs text-gray-400">{{ row.label }}</span>
                    <span
                      class="text-xs font-medium text-gray-700"
                      :class="row.mono ? 'font-mono' : ''"
                      >{{ row.value }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- Pricing -->
              <div class="space-y-2">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pricing</p>
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Unit Cost</span>
                    <span class="text-sm font-bold text-gray-700"
                      >Rs. {{ product.unitCost.toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Unit Price</span>
                    <span class="text-sm font-bold text-blue-700"
                      >Rs. {{ product.unitPrice.toFixed(2) }}</span
                    >
                  </div>
                  <div class="h-px bg-indigo-100"></div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Gross Profit</span>
                    <span class="text-sm font-bold text-emerald-600"
                      >Rs.
                      {{ (product.unitPrice - product.unitCost).toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Margin</span>
                    <span :class="marginTextClass" class="text-sm font-bold">{{ margin }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stock Levels -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Stock Configuration
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  class="text-center bg-amber-50 rounded-xl p-3 border border-amber-100"
                >
                  <p class="text-xl font-bold text-amber-600">{{ product.minStockLevel }}</p>
                  <p class="text-xs text-amber-500 mt-0.5">Min Stock</p>
                </div>
                <div
                  class="text-center bg-orange-50 rounded-xl p-3 border border-orange-100"
                >
                  <p class="text-xl font-bold text-orange-600">{{ product.reorderPoint }}</p>
                  <p class="text-xs text-orange-500 mt-0.5">Reorder Point</p>
                </div>
                <div class="text-center bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p class="text-xl font-bold text-blue-600">{{ product.reorderQuantity }}</p>
                  <p class="text-xs text-blue-500 mt-0.5">Reorder Qty</p>
                </div>
                <div
                  class="text-center bg-emerald-50 rounded-xl p-3 border border-emerald-100"
                >
                  <p class="text-xl font-bold text-emerald-600">{{ product.maxStockLevel }}</p>
                  <p class="text-xs text-emerald-500 mt-0.5">Max Stock</p>
                </div>
              </div>
            </div>

            <!-- Footer metadata -->
            <div
              class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100"
            >
              <span>Created {{ formatDate(product.createdAt) }}</span>
              <span class="font-mono">{{ product.id.substring(0, 8) }}...</span>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-gray-100 pt-4"
          >
            <button
              @click="$emit('close')"
              class="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors order-last sm:order-first"
            >
              Close
            </button>
            <button
              @click="$emit('edit', product)"
              class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['close', 'edit'])

const margin = computed(() => {
  if (props.product.unitCost === 0) return '0.0'
  return (((props.product.unitPrice - props.product.unitCost) / props.product.unitCost) * 100).toFixed(1)
})

const marginTextClass = computed(() => {
  const m = parseFloat(margin.value)
  if (m >= 30) return 'text-emerald-600'
  if (m >= 10) return 'text-amber-600'
  return 'text-red-500'
})

const detailRows = computed(() => [
  { label: 'Barcode', value: props.product.barcode || '—', mono: true },
  { label: 'Unit of Measure', value: props.product.unitOfMeasure, mono: false },
  { label: 'Supplier', value: props.product.supplierName || '—', mono: false },
  { label: 'Category ID', value: props.product.categoryId.substring(0, 12) + '...', mono: true },
])

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
</script>
