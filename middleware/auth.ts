export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token = localStorage.getItem('accessToken')

  if (!token && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }
})