const API_URL = import.meta.env.VITE_API_URL

// 🔐 Logg inn og få token + brukerdata
export async function login(navn, passord) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ navn, passord }),
  })

  if (!res.ok) throw new Error('Feil brukernavn eller passord')
  return await res.json()
}

// ➕ Registrer ny bruker
export async function registrer(navn, passord) {
  const res = await fetch(`${API_URL}/registrer`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ navn, passord }),
  })

  if (!res.ok) throw new Error('Brukernavn finnes allerede')
  return await res.json()
}

// 🧠 Hent fremgang (krever token)
export async function hentFremgang(navn, token) {
  const res = await fetch(`${API_URL}/bruker/${navn}/fremgang`, {
    headers: {
      mode: 'cors',
      Authorization: `Bearer ${token}`,
    }
  })

  if (!res.ok) throw new Error('Kunne ikke hente fremgang')
  return await res.json()
}

// 💾 Lagre svar (krever token)
export async function lagreSvar(navn, id, svar, token) {
  const res = await fetch(`${API_URL}/bruker/${navn}/fremgang`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ id, svar }),
  })

  if (!res.ok) throw new Error('Kunne ikke lagre svar')
  return await res.json()
}

export async function oppdaterRolle(navn, rolle, token) {
  const res = await fetch(`${API_URL}/admin/rolle`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ navn, rolle })
  })

  if (!res.ok) throw new Error('Kunne ikke oppdatere rolle')
  return await res.json()
}


// 👥 Hent alle brukere (admin only)
export async function hentAlleBrukere(token) {
  const res = await fetch(`${API_URL}/brukere`, {
    headers: {
      mode: 'cors',
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error('Kunne ikke hente brukere')
  return await res.json()
}