import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [navn, setNavn] = useState('')
  const [passord, setPassord] = useState('')
  const [feil, setFeil] = useState('')
  const { loggInn } = useAuth()
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault()
  const success = await loggInn(navn.trim().toLowerCase(), passord)

  if (!success) {
    setFeil('Feil brukernavn eller passord.')
  } else {
    navigate('/profil')
  }
}

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Logg inn</h2>

        {feil && <p className="text-red-600 text-sm">{feil}</p>}

        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          placeholder="Brukernavn"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          placeholder="Passord"
          className="w-full border p-2 rounded"
          required
        />

        <button className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
          Logg inn
        </button>

        <p className="text-sm text-center text-gray-600">
          Har du ikke bruker?{' '}
          <Link to="/registrer" className="text-blue-600 hover:underline">
            Registrer deg
          </Link>
        </p>
      </form>
    </div>
  )
}
