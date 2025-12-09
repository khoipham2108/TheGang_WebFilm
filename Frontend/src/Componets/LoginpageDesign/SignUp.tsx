import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export default function SignUp({ onSwitch }: { onSwitch: () => void }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthday, setBirthday] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { signup } = useAuth()
    const navigate = useNavigate()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Basic validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        try {
            const success = await signup(username, email, password, birthday || undefined)
            
            if (success) {
                // Navigate to main page after successful signup
                navigate('/preferences')
            } else {
                setError('Signup failed. Please try again.')
            }
        } catch (error: any) {
            console.error('Signup error:', error)
            setError('Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="auth-card" onSubmit={submit}>
            <h1 className="auth-title">Create Account</h1>

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

            <label className="auth-label">Username</label>
            <input 
                className="auth-input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                type="text" 
                placeholder="Your username"
                required
                disabled={loading}
            />

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
                minLength={6}
            />

            <label className="auth-label">Birthday (Optional)</label>
            <input 
                className="auth-input" 
                value={birthday} 
                onChange={(e) => setBirthday(e.target.value)} 
                type="date"
                disabled={loading}
            />

            <button className="btn btn-neon auth-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-switch">
                Already have an account?{" "}
                <button type="button" className="auth-link-btn" onClick={onSwitch}>
                    Sign in
                </button>
            </div>

            <div className="auth-back">
                <Link to="/" className="auth-link">← Back to Home</Link>
            </div>
        </form>
    );
}