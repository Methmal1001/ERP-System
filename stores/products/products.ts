import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,
    auditLogs: [],
    auditLoading: false,
  }),

  getters: {
    activeCount: (state) => state.products.filter((p) => p.isActive).length,
    inactiveCount: (state) => state.products.filter((p) => !p.isActive).length,
  },

  actions: {
    async fetchProducts(page = 1) {
      this.loading = true
      this.error = null
      const { request } = useInventoryApi()
      try {
        const res = await request('/GetAllProducts', {
          params: { page, pageSize: this.pageSize },
        })
        if (res.isSuccess) {
          this.products = res.data.products
          this.totalCount = res.data.totalCount
          this.page = res.data.page
          this.totalPages = res.data.totalPages
        }
      } catch (e: any) {
        this.error = getApiErrorMessage(e, 'Unable to connect to the server. Please check your connection.')
      } finally {
        this.loading = false
      }
    },

    async addProduct(data) {
      const auth = useAuthStore()
      const { request } = useInventoryApi()
      try {
        await request('/AddProducts', {
          method: 'POST',
          body: {
            ...data,
            createdByUserId: auth.user?.id,
            createdByUserName: auth.user?.name,
          },
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to add product') }
      }
    },

    async updateProduct(data) {
      const auth = useAuthStore()
      const { request } = useInventoryApi()
      try {
        await request('/UpdateProducts', {
          method: 'PUT',
          body: {
            ...data,
            updatedByUserId: auth.user?.id,
            updatedByUserName: auth.user?.name,
          },
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to update product') }
      }
    },

    async fetchAuditLogs(productId) {
      this.auditLoading = true
      this.auditLogs = []
      const { request } = useInventoryApi()
      try {
        const res = await request('/GetProductAuditLogs', {
          params: { productId },
        })
        if (res.isSuccess) this.auditLogs = res.data
      } catch {
        this.auditLogs = []
      } finally {
        this.auditLoading = false
      }
    },

    async deleteProduct(id, deletionReason) {
      const auth = useAuthStore()
      const { request } = useInventoryApi()
      try {
        await request('/DeleteProductsByID', {
          method: 'DELETE',
          body: {
            id,
            deletionReason,
            deletedByUserId: auth.user?.id,
            deletedByUserName: auth.user?.name,
          },
        })
        await this.fetchProducts(this.page)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: getApiErrorMessage(e, 'Failed to delete product') }
      }
    },
  },
})
