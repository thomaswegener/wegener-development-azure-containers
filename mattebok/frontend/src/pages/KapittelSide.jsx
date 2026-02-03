import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import oppgaverData from '../data/oppgaver'
import { useEffect, useState } from 'react'

export default function KapittelSide() {
  const { nummer } = useParams()
  const { bruker, lagreSvar } = useAuth()
  const oppgaver = oppgaverData[nummer] || []

  const [lokaleSvar, setLokaleSvar] = useState({})

  useEffect(() => {
    if (bruker?.fremgang) {
      setLokaleSvar(bruker.fremgang)
    }
  }, [bruker])

  if (!bruker) {
    return (
      <>
        <Header />
        <main className="p-6">
          <p className="text-red-500 text-center text-lg mt-10">
            Du må være logget inn for å gjøre oppgaver.
          </p>
        </main>
      </>
    )
  }

  const oppdaterSvar = (id, verdi) => {
    setLokaleSvar((prev) => ({ ...prev, [id]: verdi }))
    lagreSvar(id, verdi)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Kapittel {nummer}
        </h1>

        <div className="space-y-8 max-w-3xl mx-auto">
          {oppgaver.map((oppgave) => {
            const brukerSvar = lokaleSvar[oppgave.id] || ''
            const korrekt = brukerSvar.trim() !== '' && brukerSvar.trim() === oppgave.fasit

            return (
              <div
                key={oppgave.id}
                className="bg-white p-6 rounded-xl shadow border"
              >
                {oppgave.bilde && (
                  <img
                    src={oppgave.bilde}
                    alt="Illustrasjon"
                    className="w-full mb-4 rounded shadow"
                  />
                )}

                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {oppgave.tekst}
                </p>

                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={brukerSvar}
                  onChange={(e) =>
                    oppdaterSvar(oppgave.id, e.target.value)
                  }
                  placeholder="Skriv svaret ditt her"
                />

                {brukerSvar.trim() && (
                  <p
                    className={`font-semibold ${
                      korrekt ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {korrekt ? '✅ Riktig!' : '❌ Prøv igjen'}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
