import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import {
  createPinia,
  setActivePinia,
} from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('logs in with valid demo credentials', () => {
    const store = useAuthStore()

    expect(
      store.login(
        'test@example.com',
        'password',
      ),
    ).toBe(true)

    expect(store.isAuthenticated).toBe(true)
    expect(store.email).toBe(
      'test@example.com',
    )
  })

  it('logs out and clears authentication', () => {
    const store = useAuthStore()

    store.login(
      'test@example.com',
      'password',
    )

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.email).toBe('')
  })
})
