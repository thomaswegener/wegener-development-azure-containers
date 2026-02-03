import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../api/api'

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
  const [bruker, setBruker] = useState(null)

  // 🔄 Hent aktiv bruker ved oppstart (token + navn)
useEffect(() => {
  const navn = localStorage.getItem('innloggetBruker')
  const token = localStorage.getItem('token')

  console.log('📦 useEffect -> navn:', navn)
  console.log('📦 useEffect -> token:', token)

  if (navn && token) {
    api.hentFremgang(navn, token)
      .then((fremgang) => {
        console.log('✅ Fremgang hentet:', fremgang)
        setBruker({ navn, token, fremgang })
      })
      .catch((err) => {
        console.error('❌ Kunne ikke hente fremgang:', err)
        loggUt()
      })
  }
}, [])

  // 🔐 Logg inn
const loggInn = async (navn, passord) => {
  try {
    const data = await api.login(navn, passord)
    console.log('✅ Login response:', data)

    localStorage.setItem('innloggetBruker', data.navn)
    localStorage.setItem('token', data.token)

    const fremgang = await api.hentFremgang(data.navn, data.token)
    console.log('✅ Fremgang etter login:', fremgang)

    setBruker({ ...data, fremgang })
    return true
  } catch (err) {
    console.error('❌ Login-feil:', err)
    return false
  }
}
const registrer = async (navn, passord) => {
  try {
    const data = await api.registrer(navn, passord)
    console.log('✅ Registrert bruker:', data)

    localStorage.setItem('innloggetBruker', data.navn)
    localStorage.setItem('token', data.token)

    const fremgang = await api.hentFremgang(data.navn, data.token)
    setBruker({ ...data, fremgang })

    return true
  } catch (err) {
    console.error('❌ Registreringsfeil:', err)
    return false
  }
}
  // 🚪 Logg ut
  const loggUt = () => {
    setBruker(null)
    localStorage.removeItem('innloggetBruker')
    localStorage.removeItem('token')
  }

  // 👤 Oppdater profil (bare frontend state for nå)
  const oppdaterProfil = (data) => {
    if (!bruker) return
    setBruker({ ...bruker, ...data })
  }

  // 💾 Lagre svar
  const lagreSvar = async (id, svar) => {
    if (!bruker?.token) return

    await api.lagreSvar(bruker.navn, id, svar, bruker.token)
    const ny = { ...bruker.fremgang, [id]: svar }
    setBruker({ ...bruker, fremgang: ny })
  }

  return (
    <AuthContext.Provider value={{ bruker, loggInn, loggUt, registrer, oppdaterProfil, lagreSvar }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
