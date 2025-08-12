import React, { useState } from "react";

import NavBar from "../components/NavBar";
import PokemonList from "../components/pokedex-page/PokemonList";
import BackToTopButton from "../components/BackToTopButton";
import WebFooter from "../components/WebFooter";

import Pokemon from "../components/pokedex-page/Pokemon";
import PokemonInfo from "../components/pokedex-page/PokemonInfo";
import pokemonData from "../data/pokemonData.json";

const Pokedex = () => {
  const [selected, setSelected] = useState(pokemonData[0]);
  const [searchName, setSearchName] = useState("");

  function searchPokemon(pokemonList, query) {
    const lowerQuery = query.toLowerCase();
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(lowerQuery)
    );
  }

  const filtered = searchPokemon(pokemonData, searchName);

  return (
    <>
      <NavBar isPokedex={true} />
      <div className="pokedex">
        <div className="left">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value.toLowerCase())}
            className="search-bar"
          />
          <div className="pokemon-list-container">
            {filtered.map((pokemon) => (
              <Pokemon
                key={pokemon.id}
                pokemon={pokemon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </div>
        </div>
        <PokemonInfo selected={selected} setSelected={setSelected} />
      </div>
      <WebFooter />
      <BackToTopButton />
    </>
  );
};

export default Pokedex;
