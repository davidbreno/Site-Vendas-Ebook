const DEFAULT_ASAAS_BASE_URL = 'https://api.asaas.com/v3'
const SANDBOX_ASAAS_BASE_URL = 'https://api-sandbox.asaas.com/v3'

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing env var: ${name}`)
  }
  return value
}

function getAsaasBaseUrl() {
  const env = (process.env.ASAAS_ENV || '').toLowerCase()
  if (process.env.ASAAS_BASE_URL) {
    return process.env.ASAAS_BASE_URL
  }
  return env === 'sandbox' ? SANDBOX_ASAAS_BASE_URL : DEFAULT_ASAAS_BASE_URL
}

export async function asaasRequest<T>(path: string, init: RequestInit) {
  const apiKey = getRequiredEnv('ASAAS_API_KEY')
  const response = await fetch(`${getAsaasBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NebulaStudio/1.0',
      access_token: apiKey,
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Asaas request failed: ${response.status} ${errorBody}`)
  }

  return (await response.json()) as T
}
