import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { hentAlleBrukere } from '../api/api'
import { oppdaterRolle as apiOppdaterRolle } from '../api/api'

export default function AdminPanel() {
  const { bruker } = useAuth()
  const [alleBrukere, setAlleBrukere] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!bruker || bruker.rolle !== 'admin') {
      navigate('/')
    } else {
      const hentBrukere = async () => {
        try {
          const brukere = await hentAlleBrukere(bruker.token)
          setAlleBrukere(brukere)
        } catch (err) {
          console.error('❌ Klarte ikke hente brukere:', err)
        }
      }

      hentBrukere()
    }
  }, [bruker, navigate])



  const oppdaterRolle = async (navn, nyRolle) => {
    try {
      await apiOppdaterRolle(navn, nyRolle, bruker.token)
      const oppdatert = { ...alleBrukere }
      oppdatert[navn].rolle = nyRolle
      setAlleBrukere(oppdatert)
    } catch (err) {
      console.error('❌ Feil ved oppdatering av rolle:', err)
    }
  }

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">🔧 Adminpanel</h1>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Brukernavn</th>
              <th>Rolle</th>
              <th>Endre rolle</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(alleBrukere).map(([navn, data]) => (
              <tr key={navn} className="border-t">
                <td className="py-2 font-medium">{navn}</td>
                <td>{data.rolle}</td>
                <td>
                  {navn !== 'thomas' && (
                    <select
                      value={data.rolle}
                      onChange={(e) => oppdaterRolle(navn, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="elev">Elev</option>
                      <option value="lærer">Lærer</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
