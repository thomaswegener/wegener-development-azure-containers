import { Link } from 'react-router-dom'

function KapittelKort({ nummer, tittel, beskrivelse }) {
  return (
    <Link to={`/kapittel/${nummer}`} className="w-full max-w-3xl">
      <div className="bg-white min-h-[200px] rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Kapittel {nummer}: {tittel}
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          {beskrivelse}
        </p>
        <div className="mt-4">
          <button className="bg-gray-600 text-white px-6 py-2 rounded">
            Start 🚀
          </button>
        </div>
      </div>
    </Link>
  );
}

export default KapittelKort;
