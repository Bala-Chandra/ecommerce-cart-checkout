import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

export function mountWithQuasar(
  component: Parameters<typeof mount>[0],
  options: Parameters<typeof mount>[1] = {},
) {
  return mount(component, {
    ...options,
    global: {
      ...options?.global,
      plugins: [
        Quasar,
        ...(options?.global?.plugins ?? []),
      ],
    },
  })
}
