"use client";
import { useState } from "react";

export default function JobsPage() {
  const [search, setSearch] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



/*
TO DO :
- Gestion des erreurs (si pas de résultats, erreur réseau, etc.)
- Gérer la location (code postale ? ou nom de la ville ? ou les deux ?) 
- Améliorer le design (ajouter des icônes, améliorer la mise en page)
*/

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/jobs?search=${encodeURIComponent(search)}&location=${location}`
    );
    console.log("res", res);
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      setLoading(false);
      setResults([]);
      return;
    }
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Recherche d'emploi</h1>
      <div className="flex gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Métier"
          className="border p-2"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ville"
          className="border p-2"
        />
        <button
          onClick={fetchJobs}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Rechercher
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : results.length === 0 && !loading ? (
        <p>Oops, je n'ai rien trouvé !</p>
      ) : (
        <ul>
          {results?.map((job, idx) => (
            <li key={idx} className="mb-4 border p-4">
              <h2 className="font-semibold">{job.intitule}</h2>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
