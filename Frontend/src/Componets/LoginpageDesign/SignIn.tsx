import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function SignIn({ onSwitch }: { onSwitch: () => void }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const success = await login(email, password)
            
            if (success) {
                // Navigate to main page after successful login
                navigate('/preferences')
            } else {
                setError('Invalid email or password')
            }
        } catch (error: any) {
            console.error('Login error:', error)
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="auth-card" onSubmit={submit}>
            <h1 className="auth-title">Sign In</h1>

            {error && (
                <div className="error-message" style={{ 
                    color: '#e50914', 
                    backgroundColor: 'rgba(229, 9, 20, 0.1)', 
                    border: '1px solid #e50914',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            <label className="auth-label">Email</label>
            <input 
                className="auth-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="you@example.com"
                required
                disabled={loading}
            />

            <label className="auth-label">Password</label>
            <input 
                className="auth-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••"
                required
                disabled={loading}
            />

            <button className="btn btn-neon auth-submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-row">
                <label className="auth-check">
                    <input type="checkbox" /> <span>Remember me</span>
                </label>
                <a href="#" className="auth-link">Forgot password?</a>
            </div>

            <div className="auth-switch">
                New to The Gangs?{" "}
                <button type="button" className="auth-link-btn" onClick={onSwitch}>
                    Create account
                </button>
            </div>

            <div className="backdoor-info" style={{ 
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '4px',
                margin: '1rem 0',
                fontSize: '12px',
                color: '#666'
            }}>
                💡 Demo: Use any email with password "bypass123" for quick access
            </div>

            <div className="auth-back">
                <Link to="/" className="auth-link">← Back to Home</Link>
            </div>
        </form>
    );
}