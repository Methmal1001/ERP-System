import { defineStore } from 'pinia'

const API_BASE = '/api/inventory'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,
  }),

  getters: {
    activeCount: (state) => state.products.filter((p) => p.isActive).length,
    inactiveCount: (state) => state.products.filter((p) => !p.isActive).length,
  },

  actions: {
    async fetchProducts(page = 1) {
      this.loading = true
      this.error = null
      try {
        const res = await $fetch(`${API_BASE}/GetAllProducts`, {
          params: { page, pageSize: this.pageSize },
        })
        if (res.isSuccess) {
          this.products = res.data.products
          this.totalCount = res.data.totalCount
          this.page = res.data.page
          this.totalPages = res.data.totalPages
        }
      } catch {
        this.error = 'Unable to connect to the server. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async addProduct(data) {
      try {
        await $fetch(`${API_BASE}/AddProducts`, {
          method: 'POST',
          body: data,
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e) {
        return { success: false, error: e?.data?.message || 'Failed to add product' }
      }
    },

    async updateProduct(data) {
      try {
        await $fetch(`${API_BASE}/UpdateProducts`, {
          method: 'PUT',
          body: data,
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e) {
        return { success: false, error: e?.data?.message || 'Failed to update product' }
      }
    },

    async deleteProduct(id, deletionReason, deletedByUserId = 'system', deletedByUserName = 'System') {
      try {
        await $fetch(`${API_BASE}/DeleteProductsByID`, {
          method: 'DELETE',
          body: { id, deletionReason, deletedByUserId, deletedByUserName },
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e) {
        return { success: false, error: e?.data?.message || 'Failed to delete product' }
      }
    },
  },
})
