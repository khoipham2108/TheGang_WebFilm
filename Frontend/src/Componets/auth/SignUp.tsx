import { Link } from "react-router-dom";

export default function SignUp({ onSwitch }: { onSwitch: () => void }) {
    return (
        <form className="auth-card">
            <h1 className="auth-title">Create Account</h1>

            <label className="auth-label">Full name</label>
            <input className="auth-input" type="text" placeholder="Your name" />

            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com" />

            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="Minimum 8 characters" />

            <label className="auth-check" style={{ marginTop: 6 }}>
                <input type="checkbox" /> <span>I agree to the Terms & Privacy</span>
            </label>

            <button className="btn btn-neon auth-submit">Create account</button>

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
