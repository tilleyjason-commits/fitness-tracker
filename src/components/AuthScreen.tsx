import { useState } from 'react';

interface AuthScreenProps {
  onCreateAccount: (name: string, username: string, password: string) => void;
  onSignIn: (username: string, password: string) => void;
}

export function AuthScreen({ onCreateAccount, onSignIn }: AuthScreenProps) {
  const [mode, setMode] = useState<'sign-in' | 'create-account'>('sign-in');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const creatingAccount = mode === 'create-account';

  function clearForm(nextMode: 'sign-in' | 'create-account') {
    setMode(nextMode);
    setName('');
    setUsername('');
    setPassword('');
    setError('');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      if (creatingAccount) {
        onCreateAccount(name, username, password);
      } else {
        onSignIn(username, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="app auth-app">
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-hero">
            <p className="eyebrow">Personal workout history</p>
            <h1>FitTrack</h1>
            <p>Create your own account so each person can track workouts, cardio, and history separately.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{creatingAccount ? 'Create Account' : 'Sign In'}</h2>

            {creatingAccount && (
              <label>
                Name
                <input
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Jason"
                />
              </label>
            )}

            <label>
              Username
              <input
                autoComplete="username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="jason"
              />
            </label>

            <label>
              Password
              <input
                autoComplete={creatingAccount ? 'new-password' : 'current-password'}
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="At least 6 characters"
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button className="primary-auth-btn" type="submit">
              {creatingAccount ? 'Create Account' : 'Sign In'}
            </button>

            <button
              className="link-btn"
              type="button"
              onClick={() => clearForm(creatingAccount ? 'sign-in' : 'create-account')}
            >
              {creatingAccount ? 'Already have an account? Sign in' : 'Need an account? Create one'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
