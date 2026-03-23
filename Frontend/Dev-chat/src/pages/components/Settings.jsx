import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/chat.css';

function Settings() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('devchatUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('devchatUser');
      return null;
    }
  });
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem('devchatTheme') === 'dark',
  );

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [navigate, user]);

  useEffect(() => {
    localStorage.setItem('devchatTheme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleLogout = () => {
    localStorage.removeItem('devchatUser');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <main className={`settings-page ${isDarkTheme ? 'dark-theme' : ''}`}>
      <section className="settings-card">
        <div className="settings-topbar">
          <div>
            <p className="settings-label">Preferences</p>
            <h1>Settings</h1>
          </div>
          <button
            type="button"
            className="settings-back"
            onClick={() => navigate('/chat')}
          >
            Back to Chat
          </button>
        </div>

        <div className="settings-grid">
          <section className="settings-panel">
            <p className="settings-panel-label">Profile Info</p>
            <div className="settings-profile">
              <div className="settings-avatar" aria-hidden="true">
                {user.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="settings-name">{user.username}</p>
                <p className="settings-email">{user.email}</p>
              </div>
            </div>
          </section>

          <section className="settings-panel">
            <p className="settings-panel-label">Appearance</p>
            <div className="settings-row">
              <div>
                <p className="settings-item-title">Dark theme</p>
                <p className="settings-item-copy">
                  Toggle the chat workspace between light and dark mode.
                </p>
              </div>
              <button
                type="button"
                className={`theme-switch ${isDarkTheme ? 'active' : ''}`}
                onClick={() => setIsDarkTheme((current) => !current)}
                aria-label={isDarkTheme ? 'Disable dark theme' : 'Enable dark theme'}
              >
                <span className="theme-switch-track">
                  <span className="theme-switch-thumb" />
                </span>
                <span className="theme-switch-text">
                  {isDarkTheme ? 'On' : 'Off'}
                </span>
              </button>
            </div>
          </section>

          <section className="settings-panel settings-panel-muted">
            <p className="settings-panel-label">Coming Soon</p>
            <p className="settings-item-title">More options will live here</p>
            <p className="settings-item-copy">
              Notification controls, chat preferences, privacy options, and other
              features can be added later.
            </p>
          </section>
        </div>

        <div className="settings-footer">
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default Settings;
