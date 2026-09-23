import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const AUTH_STORAGE_KEY = 'ecommerce-authenticated'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(
    localStorage.getItem(AUTH_STORAGE_KEY) === 'true',
  )

  const userName = ref(
    localStorage.getItem('ecommerce-user-name') ?? '',
  )

  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false
    }

    isAuthenticated.value = true
    userName.value = email

    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    localStorage.setItem('ecommerce-user-name', email)

    return true
  }

  const logout = () => {
    isAuthenticated.value = false
    userName.value = ''

    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem('ecommerce-user-name')
  }

  const displayName = computed(() => {
    return userName.value || 'Guest'
  })

  return {
    isAuthenticated,
    userName,
    displayName,
    login,
    logout,
  }
})
