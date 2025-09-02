import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext'
import { apiFetch } from '../api'
import { Link } from 'react-router-dom'

interface StoreItem {
  id: string
  name: string
  email?: string
  address?: string
  averageRating: number
}

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: 'radial-gradient(1000px 400px at 10% 0%, #0e1026 0%, #050512 60%)',
  color: '#e4e7ff',
  fontFamily: 'Inter, ui-sans-serif, system-ui',
}

const card: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  background: 'linear-gradient(180deg, rgba(20,22,54,0.9), rgba(10,11,30,0.9))',
  border: '1px solid rgba(93, 112, 255, 0.25)',
  boxShadow: '0 0 0 1px rgba(93,112,255,0.15), 0 10px 40px rgba(9,10,30,0.6)',
}

const neon = (text: string) => (
  <span style={{ color: '#9db1ff', textShadow: '0 0 18px rgba(93,112,255,0.6)' }}>{text}</span>
)

export const StoresPage = () => {
  const { user, logout } = useAuth()
  const [q, setQ] = useState('')
  const [stores, setStores] = useState<StoreItem[]>([])
  const [myRatings, setMyRatings] = useState<Record<string, number>>({})

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch<{ items: StoreItem[] }>(`/stores${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      setStores(res.items)
      if (user) {
        const entries = await Promise.all(
          res.items.map(async s => {
            try {
              const r = await apiFetch<{ id: string; value: number }>(`/ratings/me?storeId=${s.id}`)
              return [s.id, r?.value] as const
            } catch {
              return [s.id, 0] as const
            }
          }),
        )
        setMyRatings(Object.fromEntries(entries))
      }
    }
    load()
  }, [q, user])

  const rate = async (storeId: string, value: number) => {
    await apiFetch('/ratings', { method: 'POST', body: JSON.stringify({ storeId, value }) })
    setMyRatings(prev => ({ ...prev, [storeId]: value }))
  }

  return (
    <div style={shell}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: '1px solid rgba(93,112,255,0.2)' }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.6 }}>{neon('KRISHANA RATER')}</div>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/" style={{ color: '#cdd6ff' }}>Stores</Link>
          <Link to="/owner" style={{ color: '#cdd6ff' }}>Owner</Link>
          <Link to="/admin" style={{ color: '#cdd6ff' }}>Admin</Link>
          {user ? (
            <button onClick={logout} style={{ background: 'transparent', color: '#ff9da6', border: '1px solid rgba(255,157,166,0.5)', borderRadius: 8, padding: '6px 10px' }}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={{ color: '#9fffdf' }}>Login</Link>
              <Link to="/signup" style={{ color: '#9fffdf' }}>Signup</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <input placeholder="Search name or address" value={q} onChange={e => setQ(e.target.value)}
                 style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid rgba(93,112,255,0.35)', background: 'rgba(9,10,30,0.7)', color: '#eaf0ff' }} />
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {stores.map(s => (
            <div key={s.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{s.name}</div>
                  <div style={{ opacity: 0.8 }}>{s.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>Overall: <span style={{ color: '#ffd479' }}>{s.averageRating.toFixed(1)}/5</span></div>
                  {user && (
                    <div style={{ marginTop: 8 }}>
                      <label>My rating: </label>
                      <select
                        value={myRatings[s.id] ?? 0}
                        onChange={e => rate(s.id, Number(e.target.value))}
                        style={{ background: 'transparent', color: '#e4e7ff', border: '1px solid rgba(93,112,255,0.35)', borderRadius: 8, padding: '4px 6px' }}
                      >
                        <option value={0}>-</option>
                        {[1, 2, 3, 4, 5].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
