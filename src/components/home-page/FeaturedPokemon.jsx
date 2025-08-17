import React from "react";
import pokemonData from "../../data/pokemonData.json";
import Pokemon from "../pokedex-page/Pokemon";
import { Link } from "react-router";
import "./FeaturedPokemon.css";

// Simple seeded random generator (mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FeaturedPokemon = () => {
  // Get a local date-based seed in format YYYYMMDD as number
  const todaySeed = Number(
    new Date().toLocaleDateString("en-CA").replace(/-/g, "")
  );

  // Generate 5 unique indices based on seed
  const getDailyRandomPokemons = (data, count = 5, seed = todaySeed) => {
    const rng = mulberry32(seed);
    const result = [];
    const usedIndices = new Set();

    while (result.length < count && usedIndices.size < data.length) {
      const randIndex = Math.floor(rng() * data.length);
      if (!usedIndices.has(randIndex)) {
        usedIndices.add(randIndex);
        result.push(data[randIndex]);
      }
    }

    return result;
  };

  const dailyPokemons = getDailyRandomPokemons(pokemonData, 5);

  return (
    <div>
      <h2 className="daily-spotlight">PokéHub Daily Spotlight</h2>
      <div className="featured-pokemon-container">
        {dailyPokemons.map((pokemon) => (
          <Link key={pokemon.id} to={`/pokedex/${pokemon.id}`}>
            <Pokemon pokemon={pokemon} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPokemon;
