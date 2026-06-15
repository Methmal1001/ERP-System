<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Back link -->
    <NuxtLink
      to="/products"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Products
    </NuxtLink>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <StatCard label="Deleted" :value="store.deletedProducts.length" hint="Products in recycle bin" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </template>
      </StatCard>
      <StatCard label="Showing" :value="filteredProducts.length" hint="After filters" color="gray">
        <template #icon>
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Search -->
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, SKU or category..."
        class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
      />
      <button
        v-if="search"
        @click="search = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Error State -->
    <div
      v-if="store.deletedError && !store.deletedLoading"
      class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
    >
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load deleted products</p>
      <p class="text-red-500 text-sm mb-4">{{ store.deletedError }}</p>
      <button
        @click="store.fetchDeletedProducts()"
        class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.deletedLoading">
      <div class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="filteredProducts.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">Recycle bin is empty</p>
        <p class="text-gray-400 text-sm">
          {{ search ? `No results for "${search}" — try a different term` : 'Deleted products will appear here' }}
        </p>
        <button
          v-if="search"
          @click="search = ''"
          class="px-4 py-2 mt-5 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Clear search
        </button>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Product</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Category</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Price</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Deleted By</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Reason</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Deleted At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="item in filteredProducts"
                :key="item.id"
                class="hover:bg-red-50/30 transition-colors"
              >
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-sm font-bold">{{ item.name.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ item.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium">{{ item.categoryName || '—' }}</span>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <p class="text-sm font-bold text-blue-700">Rs. {{ item.unitPrice.toFixed(2) }}</p>
                  <p class="text-xs text-gray-400">Cost: {{ item.unitCost.toFixed(2) }}</p>
                </td>
                <td class="px-4 py-3.5">
                  <p class="text-sm font-medium text-gray-700">{{ item.deletedByUserName || '—' }}</p>
                </td>
                <td class="px-4 py-3.5 hidden lg:table-cell">
                  <p class="text-xs text-gray-500 max-w-xs truncate" :title="item.deletionReason || ''">{{ item.deletionReason || '—' }}</p>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <p class="text-sm text-gray-600">{{ formatDateTime(item.deletedAt) }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import { useProductsStore } from '~/stores/products/products'

definePageMeta({
  middleware: 'auth',
  title: 'Deleted Products',
  subtitle: 'Recycle bin — review deleted products and who removed them',
})

const store = useProductsStore()
const search = ref('')

const filteredProducts = computed(() => {
  let list = store.deletedProducts
  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.categoryName ?? '').toLowerCase().includes(q),
    )
  }
  return list
})

const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

onMounted(() => {
  store.fetchDeletedProducts()
})
</script>
