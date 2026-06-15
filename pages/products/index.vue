<template>
  <div class="p-4 sm:p-6 lg:p-8 space-y-5">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total" :value="store.totalCount" hint="Products" color="blue">
        <template #icon>
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Showing" :value="store.products.length" hint="This page" color="indigo">
        <template #icon>
          <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Active" :value="store.activeCount" hint="Products" color="emerald">
        <template #icon>
          <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </template>
      </StatCard>
      <StatCard label="Inactive" :value="store.inactiveCount" hint="Products" color="red">
        <template #icon>
          <svg class="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
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

      <!-- Filters -->
      <div class="flex gap-2">
        <select
          v-model="filterStatus"
          class="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        <!-- View Toggle -->
        <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
            class="p-2.5 transition-colors"
            title="Grid view"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
            class="p-2.5 transition-colors"
            title="List view"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>

        <NuxtLink
          to="/products/deleted"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap"
          title="View deleted products"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
          <span class="hidden sm:inline">Recycle Bin</span>
        </NuxtLink>

        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="store.error && !store.loading"
      class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
    >
      <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p class="text-red-700 font-semibold mb-1">Failed to load products</p>
      <p class="text-red-500 text-sm mb-4">{{ store.error }}</p>
      <button
        @click="store.fetchProducts()"
        class="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Loading Skeleton -->
    <template v-else-if="store.loading">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
          <div class="h-28 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div class="p-4 space-y-3">
            <div class="flex gap-2">
              <div class="h-5 bg-gray-200 rounded-md w-20"></div>
              <div class="h-5 bg-gray-100 rounded-md w-12"></div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="h-12 bg-gray-100 rounded-xl"></div>
              <div class="h-12 bg-gray-100 rounded-xl"></div>
            </div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
            <div class="grid grid-cols-3 gap-1.5">
              <div class="h-10 bg-gray-100 rounded-lg"></div>
              <div class="h-10 bg-gray-100 rounded-lg"></div>
              <div class="h-10 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else-if="filteredProducts.length === 0">
      <div class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold text-lg mb-1">No products found</p>
        <p class="text-gray-400 text-sm">
          {{ search ? `No results for "${search}" — try a different term` : 'Add your first product to get started' }}
        </p>
        <div class="flex gap-2 justify-center mt-5">
          <button
            v-if="search"
            @click="search = ''"
            class="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear search
          </button>
          <button
            v-if="!search"
            @click="openAddModal"
            class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            Add First Product
          </button>
        </div>
      </div>
    </template>

    <!-- Grid View -->
    <template v-else-if="viewMode === 'grid'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </template>

    <!-- List View -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Product</th>
                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Category</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Price</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">Stock</th>
                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th class="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-blue-50/30 transition-colors"
              >
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-sm font-bold">{{ product.name.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ product.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium">{{ product.categoryName }}</span>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <p class="text-sm font-bold text-blue-700">Rs. {{ product.unitPrice.toFixed(2) }}</p>
                  <p class="text-xs text-gray-400">Cost: {{ product.unitCost.toFixed(2) }}</p>
                </td>
                <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                  <div class="flex items-center justify-center gap-1 text-xs">
                    <span class="text-amber-600 font-medium">{{ product.minStockLevel }}</span>
                    <span class="text-gray-300">—</span>
                    <span class="text-emerald-600 font-medium">{{ product.maxStockLevel }}</span>
                  </div>
                  <p class="text-xs text-gray-400">Min — Max</p>
                </td>
                <td class="px-4 py-3.5 text-center">
                  <span
                    :class="product.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'"
                    class="px-2 py-0.5 rounded-full text-xs font-semibold"
                  >
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openViewModal(product)"
                      class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button
                      @click="openEditModal(product)"
                      class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit product"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(product)"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <div
      v-if="store.totalPages > 1 && !store.loading"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
    >
      <p class="text-sm text-gray-400">
        Page <span class="font-semibold text-gray-600">{{ store.page }}</span> of
        <span class="font-semibold text-gray-600">{{ store.totalPages }}</span>
        — <span class="font-semibold text-gray-600">{{ store.totalCount }}</span> total products
      </p>
      <div class="flex gap-1.5">
        <button
          @click="goToPage(store.page - 1)"
          :disabled="store.page === 1 || store.loading"
          class="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          ← Prev
        </button>
        <button
          v-for="p in paginationPages"
          :key="p"
          @click="goToPage(p)"
          :class="p === store.page
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
          class="w-9 h-9 text-sm border rounded-xl transition-colors"
        >
          {{ p }}
        </button>
        <button
          @click="goToPage(store.page + 1)"
          :disabled="store.page === store.totalPages || store.loading"
          class="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ProductFormModal
      v-if="showFormModal"
      :product="editingProduct"
      @close="showFormModal = false"
      @success="handleFormSuccess"
    />
    <ProductDetailModal
      v-if="showDetailModal && viewingProduct"
      :product="viewingProduct"
      @close="showDetailModal = false"
      @edit="(p) => { showDetailModal = false; openEditModal(p) }"
    />
    <DeleteProductModal
      v-if="showDeleteModal && deletingProduct"
      :product="deletingProduct"
      @close="showDeleteModal = false"
      @success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '~/components/ui/StatCard.vue'
import ProductCard from '~/components/products/ProductCard.vue'
import ProductFormModal from '~/components/products/ProductFormModal.vue'
import ProductDetailModal from '~/components/products/ProductDetailModal.vue'
import DeleteProductModal from '~/components/products/DeleteProductModal.vue'
import { useProductsStore } from '~/stores/products/products'

definePageMeta({
  middleware: 'auth',
  title: 'Products',
  subtitle: 'Manage your product catalog and inventory',
})

const store = useProductsStore()
const toast = useToast()

const viewMode = ref('grid')
const search = ref('')
const filterStatus = ref('all')

const showFormModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref(null)
const viewingProduct = ref(null)
const deletingProduct = ref(null)

const filteredProducts = computed(() => {
  let list = store.products
  if (filterStatus.value !== 'all') {
    list = list.filter((p) => (filterStatus.value === 'active' ? p.isActive : !p.isActive))
  }
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

const paginationPages = computed(() => {
  const total = store.totalPages
  const cur = store.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const goToPage = (page) => {
  if (page < 1 || page > store.totalPages || store.loading) return
  store.fetchProducts(page)
}

const openAddModal = () => {
  editingProduct.value = null
  showFormModal.value = true
}

const openEditModal = (product) => {
  editingProduct.value = product
  showFormModal.value = true
}

const openViewModal = (product) => {
  viewingProduct.value = product
  showDetailModal.value = true
}

const openDeleteModal = (product) => {
  deletingProduct.value = product
  showDeleteModal.value = true
}

const handleFormSuccess = () => {
  toast.success(editingProduct.value ? 'Product updated successfully.' : 'Product added successfully.')
}

const handleDeleteSuccess = () => {
  toast.success('Product deleted successfully.')
}

onMounted(() => {
  store.fetchProducts()
})
</script>
