import { useEffect, useState } from 'react'
import { apiFetch } from '../api'

export const OwnerPage = () => {
  const [data, setData] = useState<any>(null)
  const [avg, setAvg] = useState<number>(0)

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch<any>('/stores/owner/me')
      setData(res)
      const a = res?.ratings?.length ? res.ratings.reduce((t: number, r: any) => t + r.value, 0) / res.ratings.length : 0
      setAvg(a)
    }
    load().catch(() => setData(null))
  }, [])

  if (!data) return <div style={{ maxWidth: 800, margin: '20px auto' }}>No store linked to your account.</div>

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>{data.name}</h2>
      <div>Average rating: {avg.toFixed(1)}/5</div>
      <h3 style={{ marginTop: 16 }}>Raters</h3>
      <ul>
        {data.ratings.map((r: any) => (
          <li key={r.id}>{r.user?.name || r.user?.email} - {r.value}</li>
        ))}
      </ul>
    </div>
  )
}
