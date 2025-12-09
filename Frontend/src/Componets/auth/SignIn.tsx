import { Link } from "react-router-dom";

export default function SignIn({ onSwitch }: { onSwitch: () => void }) {
    return (
        <form className="auth-card">
            <h1 className="auth-title">Sign In</h1>

            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com" />

            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" />

            <button className="btn btn-neon auth-submit">Sign In</button>

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

            <div className="auth-back">
                <Link to="/" className="auth-link">← Back to Home</Link>
            </div>
        </form>
    );
}
