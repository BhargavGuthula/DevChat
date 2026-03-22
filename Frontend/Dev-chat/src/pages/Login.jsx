import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('devchatUser');

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser) {
        navigate('/chat');
      }
    } catch {
      localStorage.removeItem('devchatUser');
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint =
        mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        mode === 'signup'
          ? formData
          : { email: formData.email, password: formData.password };
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      localStorage.setItem('devchatUser', JSON.stringify(response.data));
      onAuthSuccess?.(response.data);
      setMessage(
        mode === 'signup'
          ? `Account created for ${response.data.username}.`
          : `Welcome back, ${response.data.username}.`,
      );
      navigate('/chat');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          `Unable to ${mode === 'signup' ? 'create account' : 'sign in'}. Check your details and try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="aurora" aria-hidden="true" />

      <div className="login-stage">
        <div className="finder-card">
          <div className="window-bar">
            <div className="window-controls" aria-hidden="true">
              <span className="control close" />
              <span className="control minimize" />
              <span className="control expand" />
            </div>
            <p className="window-title">DevChat Login</p>
          </div>

          <div className="window-body">
            <aside className="sidebar">
              <div className="app-badge">DC</div>
              <p className="sidebar-label">Workspace</p>
              <h1>
                {mode === 'signup'
                  ? 'Create your space in seconds.'
                  : 'Continue the conversation.'}
              </h1>
              <p className="sidebar-copy">
                {mode === 'signup'
                  ? 'Set up your account, join the workspace, and start chatting with your team.'
                  : 'Sign in to sync chats, keep your session active, and jump back into your team space.'}
              </p>
              <div className="status-pill">
                {mode === 'signup' ? 'Instant onboarding' : 'Secure login'}
              </div>
            </aside>

            <section className="content-panel">
              <nav
                className={`liquid-nav ${mode === 'signup' ? 'signup-active' : 'login-active'}`}
                aria-label="Authentication mode"
              >
                <span className="liquid-thumb" aria-hidden="true" />
                <button
                  type="button"
                  className={`liquid-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setMessage('');
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`liquid-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setMessage('');
                  }}
                >
                  Signup
                </button>
              </nav>

              <div className="content-head">
                <p>{mode === 'signup'? 'Already have an account? switch to login' :
                 `Don't have an account? switch to signup`}</p>
                <h2>
                  {mode === 'signup' ? 'Create your DevChat account' : 'Sign in to DevChat'}
                </h2>
                <p className="content-copy">
                  {mode === 'signup'
                    ? 'Fill in the details to create a new account'
                    : 'Use your account credentials to connect to the API.'}
                </p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {mode === 'signup' ? (
                  <label className="field">
                    <span>Username</span>
                    <input
                      type="text"
                      name="username"
                      placeholder="Your display name"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                  </label>
                ) : null}

                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="field">
                  <span>Password</span>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>

                {error ? <p className="form-message error">{error}</p> : null}
                {message ? (
                  <p className="form-message success">{message}</p>
                ) : null}

                <button className="submit-button" type="submit" disabled={loading}>
                  {loading
                    ? mode === 'signup'
                      ? 'Creating account...'
                      : 'Signing in...'
                    : mode === 'signup'
                      ? 'Create Account'
                      : 'Sign In'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
