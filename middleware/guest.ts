export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const auth = useAuthStore()
  if (!auth.accessToken) auth.load()

  if (auth.accessToken) {
    return navigateTo('/')
  }
})
