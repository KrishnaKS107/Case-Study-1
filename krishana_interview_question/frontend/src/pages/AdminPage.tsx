import { useEffect, useState } from 'react'
import { apiFetch } from '../api'

export const AdminPage = () => {
  const [counts, setCounts] = useState<{ users: number; stores: number; ratings: number }>({ users: 0, stores: 0, ratings: 0 })
  const [name, setName] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const users = await apiFetch<number>('/stats/users')
      const stores = await apiFetch<number>('/stats/stores')
      const ratings = await apiFetch<number>('/stats/ratings')
      setCounts({ users, stores, ratings })
    }
    // These endpoints are not implemented yet; show zeros gracefully
    load().catch(() => {})
  }, [])

  const createStore = async () => {
    setMsg(null)
    try {
      await apiFetch('/stores', { method: 'POST', body: JSON.stringify({ name, ownerId, address, email }) })
      setMsg('Store created')
    } catch (e: any) {
      setMsg(e.message || 'Failed to create store')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div>Users: {counts.users}</div>
        <div>Stores: {counts.stores}</div>
        <div>Ratings: {counts.ratings}</div>
      </div>

      <h3 style={{ marginTop: 24 }}>Create Store</h3>
      {msg && <p>{msg}</p>}
      <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Owner userId" value={ownerId} onChange={e => setOwnerId(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <button onClick={createStore}>Create</button>
      </div>
    </div>
  )
}
