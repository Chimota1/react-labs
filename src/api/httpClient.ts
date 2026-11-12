export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data?: unknown

  constructor(
    status: number,
    statusText: string,
    message: string,
    data?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

export type RequestOptions = {
  signal?: AbortSignal
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
}

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://dummyjson.com'

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = new URL(`${BASE_URL}${normalizedEndpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = buildUrl(endpoint, options?.params)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options?.headers,
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    })

    if (!response.ok) {
      let errorData: unknown
      let errorMessage = `HTTP помилка ${response.status}: ${response.statusText}`

      try {
        errorData = await response.json()
        if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData &&
          typeof (errorData as { message: unknown }).message === 'string'
        ) {
          errorMessage = (errorData as { message: string }).message
        }
      } catch {
        // Response was not JSON
      }

      throw new HttpError(response.status, response.statusText, errorMessage, errorData)
    }

    // If 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return (await response.json()) as T
  } catch (error) {
    // If request was aborted, rethrow without converting to HttpError
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }

    if (error instanceof HttpError) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Невідома мережева помилка'
    throw new HttpError(0, 'NetworkError', message)
  }
}

export const httpClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', endpoint, undefined, options)
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', endpoint, body, options)
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', endpoint, body, options)
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', endpoint, body, options)
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', endpoint, undefined, options)
  },
}
