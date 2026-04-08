const DEFAULT_PICPAY_BASE_URL = 'https://checkout-api.picpay.com'

type AccessTokenResponse = {
  access_token: string
  expires_in?: number
  token_type?: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

function getPicPayBaseUrl() {
  return process.env.PICPAY_API_BASE_URL || DEFAULT_PICPAY_BASE_URL
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing env var: ${name}`)
  }
  return value
}

export async function getPicPayAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = getRequiredEnv('PICPAY_CLIENT_ID')
  const clientSecret = getRequiredEnv('PICPAY_CLIENT_SECRET')

  const response = await fetch(`${getPicPayBaseUrl()}/oauth2/token`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`PicPay auth failed: ${response.status} ${errorBody}`)
  }

  const data = (await response.json()) as AccessTokenResponse
  const expiresInSeconds = data.expires_in ?? 300
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (expiresInSeconds - 10) * 1000,
  }

  return cachedToken.token
}

export async function picpayRequest<T>(path: string, init: RequestInit) {
  const token = await getPicPayAccessToken()
  const response = await fetch(`${getPicPayBaseUrl()}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`PicPay request failed: ${response.status} ${errorBody}`)
  }

  return (await response.json()) as T
}
