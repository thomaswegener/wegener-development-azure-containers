import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'

export default function Profil() {
  const { bruker, loggUt, oppdaterProfil } = useAuth()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState('')
  const [navn, setNavn] = useState('')

  useEffect(() => {
    if (!bruker) navigate('/login')
    else {
      setNavn(bruker.navn)
      setAvatar(bruker.avatar || '')
    }
  }, [bruker, navigate])

  const handleSave = () => {
    oppdaterProfil({ navn, avatar })
  }

  if (!bruker) return null

  return (
    <>
      <Header />
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">👤 Profil</h1>

        <label className="block mb-2 font-semibold">Navn:</label>
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Avatar URL:</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {avatar && (
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
        )}

        <button onClick={handleSave} className="bg-gray-800 text-white px-4 py-2 rounded mr-2">
          Lagre
        </button>
        <button onClick={loggUt} className="bg-red-600 text-white px-4 py-2 rounded">
          Logg ut
        </button>
      </div>
    </>
      )
}