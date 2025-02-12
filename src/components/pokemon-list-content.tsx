import { useEffect, useState } from "react";
import PokemonPreview from "./pokemon-preview";

export default function PokemonListContent() {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [limit, setLimit] = useState(5); // default to 5
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);

  async function getToken() {
    while (true) {
      const res = await fetch("https://cs391-endpoints.vercel.app/token", {
        method: "POST",
      });

      if (res.ok) return await res.text();
      if (res.status >= 500) {
        setError(true);
        return "";
      }
    }
  }

  useEffect(() => {
    async function getArtworks(token: string) {
      try {
        if (!token) throw new Error();

        const res = await fetch(
          `https://cs391-endpoints.vercel.app/pokemon?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.status >= 400 && res.status <= 499) throw new Error();
        if (res.status >= 500) {
          setError(true);
          return;
        }

        const data = await res.json();
        setToken(token);
        setPokemonList(data.results);
      } catch {
        const newToken = await getToken();
        getArtworks(newToken);
      }
    }
    getArtworks(token);
  }, [limit]);

  if (error) {
    return <p>The server is down, please try again later.</p>;
  }

  return (
    <div>
      <h1>Random Pokemon Generator</h1>
      <input
        type="number"
        placeholder="Number of Pokemon"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pokemonList.map((p) => (
          <PokemonPreview preview={p} key={p.url} />
        ))}
      </div>
    </div>
  );
}
