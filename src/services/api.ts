export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code = 'API_ERROR',
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
