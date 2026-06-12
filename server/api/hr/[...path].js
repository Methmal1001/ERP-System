import { proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const target = 'https://localhost:7077' + event.path
  return proxyRequest(event, target)
})
