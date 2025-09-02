import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export const LoginPage = () => {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>New here? <Link to="/signup">Create an account</Link></p>
    </div>
  )
}
