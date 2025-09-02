import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export const SignupPage = () => {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setOk(null)
    try {
      await signup(name, email, address, password)
      setOk('Account created. Please login.')
      nav('/login')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'Inter, system-ui' }}>
      <h2>Sign up</h2>
      {ok && <p style={{ color: 'green' }}>{ok}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} minLength={3} maxLength={60} required />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} maxLength={400} />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={8} maxLength={16} required />
        </div>
        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
