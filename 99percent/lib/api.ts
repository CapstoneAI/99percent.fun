const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getTokens(filter = 'new', type?: string) {
  const params = new URLSearchParams({ filter })
  if (type) params.append('type', type)
  const res = await fetch(`${API_URL}/api/tokens?${params}`, { next: { revalidate: 30 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.tokens || []
}

export async function getToken(address: string) {
  const res = await fetch(`${API_URL}/api/tokens/${address}`, { next: { revalidate: 30 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.token || null
}

export async function getStats() {
  const res = await fetch(`${API_URL}/api/stats`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export async function getDailyPick() {
  const res = await fetch(`${API_URL}/api/daily-pick`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.token || null
}

export async function createToken(data: {
  name: string
  ticker: string
  creator_wallet: string
  type: 'human' | 'agent'
  description?: string
  image_url?: string
  twitter_url?: string
  telegram_url?: string
  website_url?: string
  contract_address?: string
  agent_name?: string
  proof_url?: string
}) {
  const res = await fetch(`${API_URL}/api/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create token')
  return res.json()
}

export async function getComments(address: string) {
  const res = await fetch(`${API_URL}/api/comments/${address}`, { next: { revalidate: 10 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.comments || []
}

export async function postComment(token_address: string, wallet: string, content: string) {
  const res = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token_address, wallet, content }),
  })
  if (!res.ok) throw new Error('Failed to post comment')
  return res.json()
}
