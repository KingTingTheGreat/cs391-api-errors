import { useEffect, useState } from "react";
import { PokemonPreviewProps, PokemonProps } from "../types";

export default function PokemonPreview({
  preview,
}: {
  preview: PokemonPreviewProps;
}) {
  const [pokemon, setPokemon] = useState<null | PokemonProps>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(preview.url)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [preview.url]);

  return (
    <div
      style={{
        margin: "8px",
        padding: "4px",
        border: "1px",
        borderColor: "black",
        borderStyle: "solid",
        borderRadius: "10px",
        width: "250px",
        height: "250px",
        cursor: "pointer",
      }}
      onClick={() => {
        if (error || pokemon === null) return;
        console.log("pokemon", pokemon);
        if (pokemon.cries.latest) {
          new Audio(pokemon.cries.latest).play();
        } else {
          new Audio(pokemon.cries.legacy).play();
        }
      }}
    >
      {error ? (
        <p>Error loading {preview.name}</p>
      ) : pokemon === null ? (
        <p>Loading {preview.name}...</p>
      ) : (
        <>
          <h3>
            {pokemon.id}: {pokemon.name}
          </h3>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </>
      )}
    </div>
  );
}
