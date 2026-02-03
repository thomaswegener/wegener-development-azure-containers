import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import oppgaverData from '../data/oppgaver'
import { hentAlleBrukere, hentFremgang } from '../api/api'

export default function Elever() {
  const { bruker } = useAuth()
  const navigate = useNavigate()
  const [brukere, setBrukere] = useState({})

useEffect(() => {
  const tillattRolle = ['lærer', 'admin']

  if (!bruker || !tillattRolle.includes(bruker.rolle)) {
    navigate('/')
  } else {
    hentAlleBrukere(bruker.token).then(async (data) => {
      const entries = Object.entries(data).filter(([_, b]) => b.rolle === 'elev')
      console.log('📚 Hentede elever:', entries)

      const medFremgang = await Promise.all(
        entries.map(async ([brukernavn, info]) => {
          try {
            const fremgang = await hentFremgang(brukernavn, bruker.token)
            console.log(`✅ Fremgang for ${brukernavn}:`, fremgang)
            return [brukernavn, { ...info, fremgang }]
          } catch (err) {
            console.warn(`⚠️ Klarte ikke hente fremgang for ${brukernavn}`, err)
            return [brukernavn, { ...info, fremgang: {} }]
          }
        })
      )

      const result = Object.fromEntries(medFremgang)
      console.log('📊 Ferdig innhentet elevdata:', result)
      setBrukere(result)
    })
  }
}, [bruker])


  // 🧠 Tell riktig, feil og ubesvart per kapittel
  const tellFremgang = (elevData) => {
    const oppsummering = {}

    Object.entries(oppgaverData).forEach(([kapNr, oppgaver]) => {
      let riktig = 0
      let feil = 0
      let ubesvart = 0

      oppgaver.forEach(({ id, fasit }) => {
        const svar = (elevData.fremgang?.[id] || '').trim()
        if (!svar) ubesvart++
        else if (svar === fasit) riktig++
        else feil++
      })

      oppsummering[kapNr] = { riktig, feil, ubesvart }
    })

    return oppsummering
  }

  // 📊 Søylevisning
  const FremdriftGraf = ({ data }) => {
    const total = data.riktig + data.feil + data.ubesvart || 1
    const pct = (n) => Math.round((n / total) * 100)

    return (
      <div className="flex h-5 w-full overflow-hidden rounded bg-gray-200 text-xs">
        <div className="bg-green-400 text-white flex items-center justify-center" style={{ width: `${pct(data.riktig)}%` }}>
          {data.riktig > 0 && <span className="px-1">{pct(data.riktig)}%</span>}
        </div>
        <div className="bg-red-400 text-white flex items-center justify-center" style={{ width: `${pct(data.feil)}%` }}>
          {data.feil > 0 && <span className="px-1">{pct(data.feil)}%</span>}
        </div>
        <div className="bg-gray-400 text-white flex items-center justify-center" style={{ width: `${pct(data.ubesvart)}%` }}>
          {data.ubesvart > 0 && <span className="px-1">{pct(data.ubesvart)}%</span>}
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
        <h1 className="text-2xl font-bold mb-4">👩‍🏫 Elevers fremdrift</h1>

        {Object.entries(brukere).length === 0 && (
          <p className="text-gray-600">Ingen elever funnet.</p>
        )}

        {Object.entries(brukere).map(([navn, data]) => {
          const fremgang = tellFremgang(data)

          return (
            <div key={navn} className="mb-6 border-t pt-4">
              <h2 className="text-lg font-semibold">{navn}</h2>
              <div className="pl-4 space-y-2">
                {Object.entries(fremgang).map(([kap, resultat]) => (
                  <div key={kap}>
                    <p className="text-sm text-gray-700 mb-1 font-medium">
                      Kapittel {kap}: ✅ {resultat.riktig} ❌ {resultat.feil} ⚪ {resultat.ubesvart}
                    </p>
                    <FremdriftGraf data={resultat} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
