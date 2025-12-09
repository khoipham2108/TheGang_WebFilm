import React, { useState } from "react";
import {
  signup,
  login,
  saveAuthData,
  getCurrentUser,
} from "../services/authApi";
import moviesClient from "../services/moviesClient";

export default function BackendTest() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("secret");
  const [username, setUsername] = useState("tester");
  const [message, setMessage] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[] | null>(null);

  const handleSignup = async () => {
    setMessage("Signing up...");
    try {
      const res = await signup({ username, email, password });
      if (res.data.success && res.data.token && res.data.user) {
        saveAuthData(res.data.token, res.data.user);
        setMessage("Signup successful");
      } else {
        setMessage("Signup failed: " + res.data.message);
      }
    } catch (err: any) {
      setMessage(
        "Signup error: " +
          (err?.response?.data?.detail || err.message || String(err))
      );
    }
  };

  const handleLogin = async () => {
    setMessage("Logging in...");
    try {
      const res = await login({ email, password });
      if (res.data.success && res.data.token && res.data.user) {
        saveAuthData(res.data.token, res.data.user);
        setMessage("Login successful");
      } else {
        setMessage("Login failed: " + res.data.message);
      }
    } catch (err: any) {
      setMessage(
        "Login error: " +
          (err?.response?.data?.detail || err.message || String(err))
      );
    }
  };

  const handleGetPopular = async () => {
    setMessage("Fetching popular movies...");
    try {
      const data = await moviesClient.getPopularMovies(1);
      setMovies(data.results);
      setMessage(`Fetched ${data.results.length} movies`);
    } catch (err: any) {
      setMessage("Fetch error: " + (err?.message || String(err)));
    }
  };

  const handleShowUser = () => {
    const u = getCurrentUser();
    setMessage(
      u ? `Current user: ${u.username} (${u.email})` : "No user stored"
    );
  };

  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
        margin: 12,
        background: "#fff",
      }}
    >
      <h3>Backend Test</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={handleSignup}>Signup</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleShowUser}>Show Stored User</button>
        <button onClick={handleGetPopular}>Get Popular Movies</button>
      </div>
      <div style={{ minHeight: 24, marginBottom: 8 }}>{message}</div>
      {movies && (
        <div style={{ maxHeight: 250, overflow: "auto" }}>
          <ul>
            {movies.map((m) => (
              <li key={m.id}>
                {m.title} ({m.release_date})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
