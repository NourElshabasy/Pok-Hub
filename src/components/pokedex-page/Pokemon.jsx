import React from "react";
import pokemonData from "../../data/pokemonData.json";

const Pokemon = ({ pokemon, selected, setSelected }) => {
  return (
    <div
      className={`pkmn ${selected === pokemon ? "selected" : ""}`}
      onClick={selected && (() => setSelected(pokemon))}
    >
      <img
        src={pokemon.sprite_bw}
        alt={`${pokemon.name} sprite`}
        className="pkmn-img"
      />
      <div className="pkmn-number">
        N&deg;{pokemon.id.toString().padStart(4, "0")}
      </div>
      <div className="pkmn-name">{pokemon.name}</div>
      <div className="pkmn-types">
        {pokemon.types.map((type) => (
          <span key={type} className={`type-box ${type}`}>
            {type.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Pokemon;
