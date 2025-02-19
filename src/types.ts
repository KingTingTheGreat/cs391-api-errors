export type PokemonPreviewProps = {
  name: string;
  url: string;
};

export type PokemonProps = {
  name: string;
  sprites: {
    front_default: string;
  };
  id: number;
  cries: {
    latest: string;
    legacy: string;
  };
};
