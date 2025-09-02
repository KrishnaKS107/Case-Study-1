import { useEffect, useState } from 'react'
import { apiFetch } from '../api'
import { useAuth } from '../state/AuthContext'
import { Link } from 'react-router-dom'

interface AppStats {
  id: string;
  name: string;
  developer: string;
  description: string;
  downloads: number;
  ratings: number;
  averageRating: number;
  keywordUsage: {
    inName: number;
    subtitle: number | null;
  };
  storeRank: number | null;
  paidAds: string;
  dpr: number;
}

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: 'radial-gradient(1000px 400px at 10% 0%, #0e1026 0%, #050512 60%)',
  color: '#e4e7ff',
  fontFamily: 'Inter, ui-sans-serif, system-ui',
}

const card: React.CSSProperties = {
  padding: 0,
  borderRadius: 14,
  background: '#fff',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  overflow: 'hidden',
}

const tableHeader: React.CSSProperties = {
  padding: '12px 16px',
  fontWeight: 600,
  color: '#6b7280',
  borderBottom: '1px solid #e5e7eb',
  textAlign: 'left',
  fontSize: '12px',
  backgroundColor: '#f9fafb',
}

const tableCell: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  textAlign: 'left',
  color: '#374151',
  fontSize: '14px',
}

const errorCard: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  background: 'linear-gradient(180deg, rgba(254,242,242,1), rgba(254,226,226,1))',
  border: '1px solid #fca5a5',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  color: '#b91c1c',
  marginBottom: 24,
}

const ChartBar = ({ data, color }: { data: number[], color: string }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div style={{ width: '100%', height: 24, display: 'flex', alignItems: 'flex-end' }}>
      {data.map((value, index) => {
        const percentage = Math.min(100, Math.max(10, (value / maxValue) * 100))
        return (
          <div 
            key={index} 
            style={{ 
              height: `${percentage}%`, 
              width: 3, 
              background: color,
              marginRight: 2,
              minHeight: 2,
            }} 
          />
        )
      })}
    </div>
  )
}

export const AnalyticsPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<AppStats[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch<{ items: AppStats[] }>('/stats/apps')
        setStats(data.items)
      } catch (err: any) {
        console.error('Failed to load app statistics', err)
        setError(err.message || 'Failed to load app statistics. Please try again later.')
        // Set fallback data if API fails
        if (retryCount > 2) {
          setStats([
            {
              id: '1',
              name: 'Video Filters Photo Editor - TON',
              developer: 'Onelight Apps CY Ltd',
              description: 'Aesthetic presets & effects',
              downloads: 13000,
              ratings: 170,
              averageRating: 4.81,
              keywordUsage: { inName: 1, subtitle: null },
              storeRank: null,
              paidAds: 'Not Seen',
              dpr: 76
            },
            // Fallback data would continue here
          ])
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadStats()
    
    // Set up automatic retry with exponential backoff
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 1000 * Math.pow(2, retryCount)) // 1s, 2s, 4s
      
      return () => clearTimeout(timer)
    }
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  // Generate mock chart data for each app
  const generateChartData = (appId: string, type: 'downloads' | 'ratings') => {
    // Use app ID as seed for consistent but different patterns
    const seed = parseInt(appId) || 1;
    const length = 15;
    const data = [];
    
    for (let i = 0; i < length; i++) {
      // Generate semi-random values that follow a pattern
      const base = type === 'downloads' ? 50 : 30;
      const variance = type === 'downloads' ? 30 : 20;
      const value = base + Math.sin(i * 0.5 + seed) * variance + Math.random() * 10;
      data.push(Math.max(0, value));
    }
    
    return data;
  };

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', color: '#374151' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.6, color: '#4f46e5' }}>KRISHANA ANALYTICS</div>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/" style={{ color: '#6b7280' }}>Stores</Link>
          <Link to="/analytics" style={{ color: '#4f46e5', fontWeight: 600 }}>Analytics</Link>
          <Link to="/owner" style={{ color: '#6b7280' }}>Owner</Link>
          <Link to="/admin" style={{ color: '#6b7280' }}>Admin</Link>
          {user ? (
            <button onClick={() => {}} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 8, padding: '6px 10px' }}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={{ color: '#10b981' }}>Login</Link>
              <Link to="/signup" style={{ color: '#10b981' }}>Signup</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#111827' }}>App Performance Analytics</h1>
          <p style={{ color: '#6b7280' }}>Track your app's performance metrics and compare with competitors</p>
        </div>

        {loading && (
          <div style={{ ...card, padding: 24, background: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 12, color: '#4b5563' }}>Loading analytics data...</div>
              <div style={{ width: '100%', height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: '30%', 
                    height: '100%', 
                    background: '#4f46e5',
                    animation: 'loading 1.5s infinite ease-in-out',
                  }} 
                />
              </div>
              <style>{`
                @keyframes loading {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(400%); }
                }
              `}</style>
            </div>
          </div>
        )}

        {error && (
          <div style={errorCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Error loading analytics data</div>
                <div>{error}</div>
              </div>
              <button 
                onClick={handleRetry}
                style={{ 
                  background: 'rgba(239,68,68,0.1)', 
                  border: '1px solid #fca5a5', 
                  borderRadius: 8, 
                  padding: '8px 16px',
                  color: '#b91c1c',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && stats.length > 0 && (
          <div style={card}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
              <thead>
                <tr>
                  <th style={{ ...tableHeader, width: 40 }}></th>
                  <th style={{ ...tableHeader, width: '25%' }}>APP</th>
                  <th style={tableHeader}>IN NAME</th>
                  <th style={tableHeader}>SUBTITLE</th>
                  <th style={{ ...tableHeader, width: '12%' }}>EST. DOWNLOADS</th>
                  <th style={tableHeader}>PAID ADS</th>
                  <th style={tableHeader}>STORE RANK</th>
                  <th style={{ ...tableHeader, width: '12%' }}>NEW RATINGS</th>
                  <th style={tableHeader}>DPR</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((app, index) => {
                  const downloadChartData = generateChartData(app.id, 'downloads');
                  const ratingChartData = generateChartData(app.id, 'ratings');
                  
                  return (
                    <tr key={app.id} style={{ background: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                      <td style={{ ...tableCell, width: 40 }}>
                        <input type="checkbox" style={{ margin: 0 }} />
                      </td>
                      <td style={tableCell}>
                        <div style={{ fontWeight: 600 }}>{app.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{app.description}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Free · {app.developer}</div>
                      </td>
                      <td style={tableCell}>{app.keywordUsage.inName ? `${app.keywordUsage.inName} time${app.keywordUsage.inName !== 1 ? 's' : ''}` : 'Not used'}</td>
                      <td style={tableCell}>{app.keywordUsage.subtitle ? `${app.keywordUsage.subtitle} time${app.keywordUsage.subtitle !== 1 ? 's' : ''}*` : 'Not used'}</td>
                      <td style={tableCell}>
                        <div>{app.downloads ? (app.downloads / 1000).toFixed(app.downloads >= 100000 ? 1 : 0) + 'K' : 'N/A'}</div>
                        <div style={{ height: 40, marginTop: 4 }}>
                          <ChartBar data={downloadChartData} color="#4f46e5" />
                        </div>
                      </td>
                      <td style={tableCell}>
                        {app.paidAds}
                        {app.paidAds !== 'Not Seen' && (
                          <div style={{ marginTop: 4 }}>
                            <span style={{ 
                              display: 'inline-block', 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              background: '#ef4444',
                              marginRight: 4,
                              verticalAlign: 'middle'
                            }}></span>
                            {app.paidAds.includes('2') && (
                              <span style={{ 
                                display: 'inline-block', 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                background: '#3b82f6',
                                marginRight: 4,
                                verticalAlign: 'middle'
                              }}></span>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={tableCell}>
                        {app.storeRank ? `#${app.storeRank}` : 'Not ranked'}
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Photo & Video</div>
                      </td>
                      <td style={tableCell}>
                        <div>{app.ratings}</div>
                        <div>★ {app.averageRating.toFixed(2)}</div>
                        <div style={{ height: 40, marginTop: 4 }}>
                          <ChartBar data={ratingChartData} color="#f59e0b" />
                        </div>
                      </td>
                      <td style={tableCell}>{app.dpr || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && stats.length === 0 && !error && (
          <div style={{ ...card, padding: 24, background: 'white' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, color: '#4b5563' }}>No analytics data available</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}