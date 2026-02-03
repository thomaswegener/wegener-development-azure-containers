import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Registrer() {
  const { registrer } = useAuth()
  const [navn, setNavn] = useState('')
  const [passord, setPassord] = useState('')
  const [feil, setFeil] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!registrer(navn, passord)) {
      setFeil('Brukernavn er allerede i bruk.')
    } else {
      navigate('/profil')
    }
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Registrer ny bruker</h2>

        {feil && <p className="text-red-600 text-sm">{feil}</p>}

        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          placeholder="Brukernavn"
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          placeholder="Passord"
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
          Registrer
        </button>
      </form>
    </div>
  )
}
