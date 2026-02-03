import Header from './components/Header'
import KapittelKort from './components/KapittelKort'
import forsideBilde from './assets/images/forside.png'


function App() {
  const kapitler = [
  {
    nummer: 1,
    tittel: "Tall i hverdagen",
    beskrivelse: "Utforsk hvordan vi bruker tall hver dag – i butikken, på klokka, i spill og når vi baker eller lager mat. Tall hjelper oss å forstå mengder, priser og tid.",
  },
  
  {
    nummer: 2,
    tittel: "Minecraft Matte",
    beskrivelse: "Lær om matte med minecraft.",
  },
  {
    nummer: 3,
    tittel: "Areal og volum",
    beskrivelse: "Finn ut hvor mye plass noe tar – både flatt og i rommet. Vi måler gulv, vegger og bokser med areal og volum.",
  },
  /*
  {
    nummer: 4,
    tittel: "Prosent og andeler",
    beskrivelse: "Hva betyr 50% eller en fjerdedel? Vi bruker prosent og andeler i tilbud, spill, og for å dele opp ting rettferdig.",
  },
  {
    nummer: 5,
    tittel: "Kvadrattall og røtter",
    beskrivelse: "Kvadrattall er tall ganget med seg selv. Vi lærer også hvordan man går motsatt vei – med kvadratrot – og hvorfor det er nyttig og gøy!",
  },
  */
];

return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Velkommen til matteboka 📘
        </h1>

        <div className="flex justify-center mb-8">
          <img
            src={forsideBilde}
            alt="Forsideillustrasjon"
            className="w-full max-w-3xl rounded-xl shadow"
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          {kapitler.map((kapittel) => (
            <KapittelKort
              key={kapittel.nummer}
              nummer={kapittel.nummer}
              tittel={kapittel.tittel}
              beskrivelse={kapittel.beskrivelse}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App