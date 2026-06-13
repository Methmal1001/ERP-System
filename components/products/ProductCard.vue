<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
  >
    <!-- Gradient Header -->
    <div class="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-4 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6 pointer-events-none"
      ></div>

      <div class="relative flex items-start justify-between">
        <div
          class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
        >
          <span class="text-white font-bold text-xl">{{ product.name.charAt(0).toUpperCase() }}</span>
        </div>
        <span
          :class="
            product.isActive
              ? 'bg-green-400/25 text-green-100 ring-1 ring-green-300/30'
              : 'bg-red-400/25 text-red-100 ring-1 ring-red-300/30'
          "
          class="px-2.5 py-1 rounded-full text-xs font-semibold"
        >
          {{ product.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
      <div class="relative mt-3">
        <h3 class="text-white font-bold text-sm leading-snug line-clamp-2">{{ product.name }}</h3>
        <p class="text-blue-200 text-xs mt-1 font-mono">{{ product.sku }}</p>
      </div>
    </div>

    <!-- Body -->
    <div class="p-4 flex-1 space-y-3">
      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
        <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
          {{ product.categoryName || 'Uncategorized' }}
        </span>
        <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs">
          {{ product.unitOfMeasure }}
        </span>
      </div>

      <!-- Pricing -->
      <div class="grid grid-cols-2 gap-2">
        <div class="rounded-xl bg-gray-50 p-2.5">
          <p class="text-xs text-gray-400 mb-0.5">Unit Cost</p>
          <p class="text-sm font-semibold text-gray-700">Rs. {{ product.unitCost.toFixed(2) }}</p>
        </div>
        <div class="rounded-xl bg-blue-50 p-2.5">
          <p class="text-xs text-blue-400 mb-0.5">Unit Price</p>
          <p class="text-sm font-semibold text-blue-700">Rs. {{ product.unitPrice.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Margin Indicator -->
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400">Profit Margin</span>
        <div class="flex items-center gap-1.5">
          <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              :style="{ width: `${Math.min(marginPercent, 100)}%` }"
              :class="marginBarClass"
              class="h-full rounded-full transition-all duration-500"
            ></div>
          </div>
          <span :class="marginTextClass" class="text-xs font-semibold">{{ margin }}%</span>
        </div>
      </div>

      <!-- Stock Levels -->
      <div class="grid grid-cols-3 gap-1.5">
        <div class="text-center bg-amber-50 rounded-lg p-2">
          <p class="text-xs font-bold text-amber-600">{{ product.minStockLevel }}</p>
          <p class="text-xs text-amber-400 mt-0.5">Min</p>
        </div>
        <div class="text-center bg-orange-50 rounded-lg p-2">
          <p class="text-xs font-bold text-orange-600">{{ product.reorderPoint }}</p>
          <p class="text-xs text-orange-400 mt-0.5">Reorder</p>
        </div>
        <div class="text-center bg-emerald-50 rounded-lg p-2">
          <p class="text-xs font-bold text-emerald-600">{{ product.maxStockLevel }}</p>
          <p class="text-xs text-emerald-400 mt-0.5">Max</p>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="px-4 pb-4 flex gap-2">
      <button
        @click="$emit('view', product)"
        class="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        View
      </button>
      <button
        @click="$emit('edit', product)"
        class="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        Edit
      </button>
      <button
        @click="$emit('delete', product)"
        class="flex-1 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

defineEmits(['view', 'edit', 'delete'])

const margin = computed(() => {
  if (props.product.unitCost === 0) return '0.0'
  return (((props.product.unitPrice - props.product.unitCost) / props.product.unitCost) * 100).toFixed(1)
})

const marginPercent = computed(() => parseFloat(margin.value))

const marginTextClass = computed(() => {
  const m = marginPercent.value
  if (m >= 30) return 'text-emerald-600'
  if (m >= 10) return 'text-amber-600'
  return 'text-red-500'
})

const marginBarClass = computed(() => {
  const m = marginPercent.value
  if (m >= 30) return 'bg-emerald-500'
  if (m >= 10) return 'bg-amber-500'
  return 'bg-red-500'
})
</script>
