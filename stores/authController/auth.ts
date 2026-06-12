import { defineStore } from 'pinia'

const API_BASE = '/api/hr/auth'

export interface HrUserProfile {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: HrUserProfile | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    permissions: (state) => state.user?.permissions ?? [],
    initials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]!.toUpperCase())
        .join('')
    },
  },

  actions: {
    can(module: string, action: string) {
      return this.permissions.includes(`${module}.${action}`)
    },

    load() {
      if (typeof localStorage === 'undefined') return
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const userJson = localStorage.getItem('hrUser')
      this.user = userJson ? JSON.parse(userJson) : null
    },

    persist() {
      if (typeof localStorage === 'undefined') return
      if (this.accessToken) localStorage.setItem('accessToken', this.accessToken)
      if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken)
      if (this.user) localStorage.setItem('hrUser', JSON.stringify(this.user))
    },

    setTokens(access: string, refresh: string) {
      this.accessToken = access
      this.refreshToken = refresh
      this.persist()
    },

    async login(email: string, password: string) {
      this.loading = true
      try {
        const res: any = await $fetch(`${API_BASE}/Login`, {
          method: 'POST',
          body: { email, password },
        })
        if (res.isSuccess) {
          this.accessToken = res.data.accessToken
          this.refreshToken = res.data.refreshToken
          this.user = res.data.user
          this.persist()
          return { success: true }
        }
        return { success: false, error: res.message || 'Login failed.' }
      } catch (e: any) {
        return {
          success: false,
          error: e?.data?.message || 'Invalid email or password.',
        }
      } finally {
        this.loading = false
      }
    },

    async register(payload: { name: string; email: string; password: string; roleId: string }) {
      this.loading = true
      try {
        const res: any = await $fetch(`${API_BASE}/Register`, {
          method: 'POST',
          body: payload,
        })
        return { success: true, data: res.data }
      } catch (e: any) {
        return {
          success: false,
          error: e?.data?.message || 'Registration failed. Please try again.',
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.accessToken && this.refreshToken) {
          await $fetch(`${API_BASE}/Logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${this.accessToken}` },
            body: { refreshToken: this.refreshToken },
          })
        }
      } catch {
        // ignore network/auth errors on logout
      }
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('hrUser')
      }
    },
  },
})
