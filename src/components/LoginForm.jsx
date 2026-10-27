import { useState } from "react";
import { login } from "../api.js";

export default function LoginForm({ onLogin, notice }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(notice || "");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      onLogin(await login(email, password));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="center">
      <form className="card login" onSubmit={handleSubmit}>
        <h1>Groundwork</h1>
        <p className="muted">Sign in to view construction leads.</p>

        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
