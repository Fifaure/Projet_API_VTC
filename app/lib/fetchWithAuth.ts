type FetchOptions = RequestInit & {
  skipRefresh?: boolean
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/v2/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
    return response.ok
  } catch {
    return false
  }
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  const { skipRefresh = false, ...fetchOptions } = options

  const optionsWithCredentials: RequestInit = {
    ...fetchOptions,
    credentials: 'include'
  }

  let response = await fetch(url, optionsWithCredentials)

  if (response.status === 401 && !skipRefresh) {
    const errorData = await response.clone().json().catch(() => ({}))
    
    if (
      errorData.error?.includes('expiré') ||
      errorData.error?.includes('expired') ||
      errorData.error?.includes('Token')
    ) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        response = await fetch(url, optionsWithCredentials)
      }
    }
  }

  return response
}

export async function fetchJsonWithAuth<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response = await fetchWithAuth(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    const status = response.status

    if (status === 204) {
      return { status }
    }

    const json = await response.json().catch(() => ({}))

    if (!response.ok) {
      return { error: json.error || 'Erreur inconnue', status }
    }

    return { data: json.data || json, status }
  } catch {
    return { error: 'Erreur de connexion', status: 0 }
  }
}
