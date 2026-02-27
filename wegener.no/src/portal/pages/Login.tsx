import React from 'react';

export default function Login() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect') ?? window.location.origin + '/portal';

  const loginUrl = `https://auth.wegener.no/login?redirect=${encodeURIComponent(redirect)}`;

  // Immediately redirect to auth service
  React.useEffect(() => {
    window.location.href = loginUrl;
  }, [loginUrl]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--muted)', fontSize: 14 }}>
      Redirecting to sign-in…
    </div>
  );
}
