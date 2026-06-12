import { defineStore } from 'pinia'

export interface Employee {
  id: string
  employeeNo: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string | null
  nationalId?: string | null
  dateOfBirth: string
  gender: string
  address?: string | null
  city?: string | null
  country?: string | null
  departmentId: string
  departmentName: string
  jobPositionId: string
  jobTitle: string
  managerId?: string | null
  managerName?: string | null
  joiningDate: string
  terminationDate?: string | null
  employmentType: string
  status: string
  basicSalary: number
  bankAccountNo?: string | null
  bankName?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface EmployeeDocument {
  id: string
  employeeId: string
  employeeName: string
  documentType: string
  fileName: string
  fileUrl: string
  expiryDate?: string | null
  note?: string | null
  uploadedAt: string
}

interface EmployeesState {
  employees: Employee[]
  current: Employee | null
  documents: EmployeeDocument[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  loading: boolean
  error: string | null
}

export const useEmployeesStore = defineStore('hrEmployees', {
  state: (): EmployeesState => ({
    employees: [],
    current: null,
    documents: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    loading: false,
    error: null,
  }),

  getters: {
    activeCount: (state) => state.employees.filter((e) => e.status === 'Active').length,
    onLeaveCount: (state) => state.employees.filter((e) => e.status === 'OnLeave').length,
    terminatedCount: (state) => state.employees.filter((e) => e.status === 'Terminated').length,
  },

  actions: {
    async fetchAll(filters: {
      search?: string
      departmentId?: string
      status?: string
      sortBy?: string
      isDescending?: boolean
      page?: number
      pageSize?: number
    } = {}) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const params: Record<string, any> = {
          page: filters.page ?? this.page,
          pageSize: filters.pageSize ?? this.pageSize,
        }
        if (filters.search) params.search = filters.search
        if (filters.departmentId) params.departmentId = filters.departmentId
        if (filters.status) params.status = filters.status
        if (filters.sortBy) params.sortBy = filters.sortBy
        if (filters.isDescending) params.isDescending = filters.isDescending

        const res: any = await request('/employees/GetEmployees', { params })
        if (res.isSuccess) {
          this.employees = res.data.employees
          this.totalCount = res.data.totalCount
          this.page = res.data.page
          this.pageSize = res.data.pageSize
          this.totalPages = res.data.totalPages
        }
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load employees. Please check your connection.'
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string) {
      this.loading = true
      this.error = null
      const { request } = useHrApi()
      try {
        const res: any = await request('/employees/GetEmployeeById', { params: { id } })
        if (res.isSuccess) this.current = res.data
        return this.current
      } catch (e: any) {
        this.error = e?.data?.message || 'Unable to load employee details.'
        return null
      } finally {
        this.loading = false
      }
    },

    async create(payload: Record<string, any>) {
      const { request } = useHrApi()
      try {
        const res: any = await request('/employees/CreateEmployee', { method: 'POST', body: payload })
        await this.fetchAll({ page: this.page })
        return { success: true, data: res.data }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to create employee.' }
      }
    },

    async update(id: string, payload: Record<string, any>) {
      const { request } = useHrApi()
      try {
        const res: any = await request(`/employees/UpdateEmployee?id=${id}`, {
          method: 'PUT',
          body: { id, ...payload },
        })
        await this.fetchAll({ page: this.page })
        if (this.current?.id === id) this.current = res.data
        return { success: true, data: res.data }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to update employee.' }
      }
    },

    async terminate(id: string) {
      const { request } = useHrApi()
      try {
        await request(`/employees/DeleteEmployee?id=${id}`, { method: 'DELETE' })
        await this.fetchAll({ page: this.page })
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to terminate employee.' }
      }
    },

    async fetchDocuments(employeeId: string) {
      const { request } = useHrApi()
      try {
        const res: any = await request('/employees/GetEmployeeDocuments', { params: { id: employeeId } })
        if (res.isSuccess) this.documents = res.data
      } catch (e: any) {
        this.documents = []
      }
    },

    async uploadDocument(payload: {
      employeeId: string
      documentType: string
      fileName: string
      fileUrl: string
      expiryDate?: string | null
      note?: string
    }) {
      const { request } = useHrApi()
      try {
        await request('/employees/UploadEmployeeDocument', { method: 'POST', body: payload })
        await this.fetchDocuments(payload.employeeId)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to upload document.' }
      }
    },

    async deleteDocument(id: string, employeeId: string) {
      const { request } = useHrApi()
      try {
        await request(`/employees/DeleteEmployeeDocument?id=${id}`, { method: 'DELETE' })
        await this.fetchDocuments(employeeId)
        return { success: true }
      } catch (e: any) {
        return { success: false, error: e?.data?.message || 'Failed to delete document.' }
      }
    },
  },
})
