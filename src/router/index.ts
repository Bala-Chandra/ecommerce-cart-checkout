import { defineRouter } from '#q-app'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

export default defineRouter(() => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    routes,
    scrollBehavior: () => ({
      left: 0,
      top: 0,
    }),
    history: createHistory(
      import.meta.env.QUASAR_VUE_ROUTER_BASE,
    ),
  })

  router.beforeEach((to) => {
    const isPublicRoute = to.path === '/'

    if (isPublicRoute) {
      return true
    }

    const authStorage = localStorage.getItem(
      'ecommerce-auth',
    )

    let authenticated = false

    try {
      if (authStorage) {
        const parsed: unknown =
          JSON.parse(authStorage)

        authenticated =
          typeof parsed === 'object' &&
          parsed !== null &&
          'authenticated' in parsed &&
          parsed.authenticated === true
      }
    } catch {
      authenticated = false
    }

    if (!authenticated) {
      return {
        path: '/',
        query: {
          message: 'Please log in to continue.',
        },
      }
    }

    return true
  })

  if (import.meta.hot) {
    handleHotUpdate(router)
  }

  return router
})
