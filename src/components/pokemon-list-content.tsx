import { useEffect, useState } from "react";
import PokemonPreview from "./pokemon-preview";
import { PokemonPreviewProps } from "../types";

export default function PokemonListContent() {
  const [pokemonList, setPokemonList] = useState<PokemonPreviewProps[]>([]);
  const [limit, setLimit] = useState(5); // default to 5
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);

  async function getToken() {
    try {
      const res = await fetch("https://cs391-endpoints.vercel.app/token", {
        method: "POST",
      });

      if (res.ok) {
        setError(false);
        return await res.text();
      }

      throw new Error("failed to get token");
    } catch (e) {
      console.error(e);
      setError(true);
      return "";
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
          console.log("server error getting pokemon");
          setError(true);
          return;
        }

        const data = await res.json();
        setToken(token);
        setPokemonList(data.results);
      } catch {
        const newToken = await getToken();
        if (!newToken) return;
        getArtworks(newToken);
      }
    }
    getArtworks(token);
  }, [limit]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <h1>Random Pokemon Generator</h1>
      {error ? (
        <p>The server is down, please try again later.</p>
      ) : (
        <>
          <input
            type="number"
            placeholder="Number of Pokemon"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              if (newLimit > 0) setLimit(newLimit);
            }}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {pokemonList.map((p) => (
              <PokemonPreview preview={p} key={p.url} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
