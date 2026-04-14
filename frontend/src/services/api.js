const BASE = 'http://localhost:8080/api'

export async function createUser(profile) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json() // { userId, name, semester, ... }
}

export async function getChatHistory(userId) {
  const res = await fetch(`${BASE}/chat/history/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch chat history')
  return res.json() // [{ role, text, time }]
}

export async function sendChatMessage(userId, text) {
  const res = await fetch(`${BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text }),
  })
  if (res.status === 429) {
    const data = await res.json()
    throw new Error(data.error || 'Rate limit exceeded')
  }
  if (!res.ok) throw new Error('Failed to send message')
  return res.json() // { role, text, time }
}

export async function submitLog(userId, text) {
  const res = await fetch(`${BASE}/logs/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (res.status === 429) {
    const data = await res.json()
    throw new Error(data.error || 'Rate limit exceeded')
  }
  if (!res.ok) throw new Error('Failed to submit log')
  return res.json() // { week, text, aryanReply, date }
}

export async function getLogs(userId) {
  const res = await fetch(`${BASE}/logs/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json() // [{ week, text, aryanReply, date }]
}
