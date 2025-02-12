import { useEffect, useState } from "react";
import { PokemonPreviewProps, PokemonProps } from "../types";

export default function PokemonPreview({
  preview,
}: {
  preview: PokemonPreviewProps;
}) {
  const [pokemon, setPokemon] = useState<null | PokemonProps>(null);

  useEffect(() => {
    fetch(preview.url)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, [preview.url]);

  return pokemon === null ? (
    <p>loading {preview.name}...</p>
  ) : (
    <div
      style={{
        margin: "8px",
        padding: "4px",
        border: "1px",
        borderColor: "black",
        borderStyle: "solid",
        borderRadius: "10px",
      }}
    >
      <h3>
        {pokemon.id}: {pokemon.name}
      </h3>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    </div>
  );
}
