import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const AUTH_KEY = 'ecommerce-auth'

interface PersistedAuth {
  authenticated: boolean
  email: string
}

function isPersistedAuth(
  value: unknown,
): value is PersistedAuth {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const candidate = value as Record<
    string,
    unknown
  >

  return (
    typeof candidate.authenticated === 'boolean' &&
    typeof candidate.email === 'string'
  )
}

function readAuth(): PersistedAuth {
  try {
    const raw = localStorage.getItem(AUTH_KEY)

    if (!raw) {
      return {
        authenticated: false,
        email: '',
      }
    }

    const parsed: unknown = JSON.parse(raw)

    if (!isPersistedAuth(parsed)) {
      localStorage.removeItem(AUTH_KEY)

      return {
        authenticated: false,
        email: '',
      }
    }

    return parsed
  } catch {
    localStorage.removeItem(AUTH_KEY)

    return {
      authenticated: false,
      email: '',
    }
  }
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const persisted = readAuth()

    const isAuthenticated = ref(
      persisted.authenticated,
    )

    const email = ref(persisted.email)

    const displayName = computed(() => {
      return email.value || 'Guest'
    })

    function login(
      value: string,
      password: string,
    ): boolean {
      if (
        !value.trim() ||
        !password.trim()
      ) {
        return false
      }

      isAuthenticated.value = true
      email.value = value.trim()

      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          authenticated: true,
          email: email.value,
        }),
      )

      return true
    }

    function logout() {
      isAuthenticated.value = false
      email.value = ''

      localStorage.removeItem(AUTH_KEY)
    }

    return {
      isAuthenticated,
      email,
      displayName,
      login,
      logout,
    }
  },
)
