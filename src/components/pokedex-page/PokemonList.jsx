import React, { useEffect, useState } from "react";
import "./PokemonList.css";
import "./PokemonInfo.css";
import "./filters.css";

import loadingGif from "../../assets/loading.gif";
import Bug from "../../assets/pkmn-type-icons/Bug.png";
import Dark from "../../assets/pkmn-type-icons/Dark.png";
import Dragon from "../../assets/pkmn-type-icons/Dragon.png";
import Electric from "../../assets/pkmn-type-icons/Electric.png";
import Fairy from "../../assets/pkmn-type-icons/Fairy.png";
import Fighting from "../../assets/pkmn-type-icons/Fighting.png";
import Fire from "../../assets/pkmn-type-icons/Fire.png";
import Flying from "../../assets/pkmn-type-icons/Flying.png";
import Ghost from "../../assets/pkmn-type-icons/Ghost.png";
import Grass from "../../assets/pkmn-type-icons/Grass.png";
import Ground from "../../assets/pkmn-type-icons/Ground.png";
import Ice from "../../assets/pkmn-type-icons/Ice.png";
import Normal from "../../assets/pkmn-type-icons/Normal.png";
import Poison from "../../assets/pkmn-type-icons/Poison.png";
import Psychic from "../../assets/pkmn-type-icons/Psychic.png";
import Rock from "../../assets/pkmn-type-icons/Rock.png";
import Steel from "../../assets/pkmn-type-icons/Steel.png";
import Water from "../../assets/pkmn-type-icons/Water.png";

import GenerationIcon from "../../assets/GenerationIcon.png";

const typeIcons = {
  Bug,
  Dark,
  Dragon,
  Electric,
  Fairy,
  Fighting,
  Fire,
  Flying,
  Ghost,
  Grass,
  Ground,
  Ice,
  Normal,
  Poison,
  Psychic,
  Rock,
  Steel,
  Water,
};

function PokemonList() {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speciesGenus, setSpeciesGenus] = useState("");
  const [flavorText, setFlavorText] = useState("");
  const [weaknesses, setWeaknesses] = useState([]);
  const [evolutionChain, setEvolutionChain] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("asc");
  const [range, setRange] = useState({ from: "", to: "" });
  const [selectedGen, setSelectedGen] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedWeakness, setSelectedWeakness] = useState("");
  const [selectedAbility, setSelectedAbility] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

  useEffect(() => {
    const BATCH_SIZE = 50;

    const fetchAllPokemon = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        if (!res.ok) throw new Error("Failed to fetch Pokémon list");

        const data = await res.json();
        const allResults = data.results;

        let loadedDetails = [];

        for (let i = 0; i < allResults.length; i += BATCH_SIZE) {
          const batch = allResults.slice(i, i + BATCH_SIZE);

          const batchDetails = await Promise.all(
            batch.map((pokemon) =>
              fetch(pokemon.url).then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
                return res.json();
              })
            )
          );

          loadedDetails = [...loadedDetails, ...batchDetails];
          setPokemonDetails([...loadedDetails]); // update after each batch
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  // Find selected Pokemon object by id
  const selectedPokemon = pokemonDetails.find(
    (p) => p.id === selectedPokemonId
  );

  // Fetch species data when selectedPokemon changes
  useEffect(() => {
    if (!selectedPokemon) {
      setSpeciesGenus("");
      setFlavorText("");
      setEvolutionChain([]);
      return;
    }

    const speciesUrl = selectedPokemon.species?.url;
    if (!speciesUrl) return;

    fetch(speciesUrl)
      .then((res) => res.json())
      .then((speciesData) => {
        const genus = speciesData.genera.find(
          (entry) => entry.language.name === "en"
        );
        setSpeciesGenus(genus?.genus || "");

        const flavor = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        setFlavorText(flavor?.flavor_text.replace(/\f/g, " ") || "");

        return fetch(speciesData.evolution_chain.url);
      })
      .then((res) => res.json())
      .then((evoData) => {
        const evoChainRaw = [];
        let evo = evoData.chain;

        // First stage
        evoChainRaw.push({
          name: evo.species.name,
          min_level: null,
        });

        while (evo?.evolves_to?.length > 0) {
          const next = evo.evolves_to[0];
          const evoDetail = next.evolution_details?.[0];
          evoChainRaw.push({
            name: next.species.name,
            min_level: evoDetail?.min_level || null,
          });
          evo = next;
        }

        // Get full Pokémon info for images
        return Promise.all(
          evoChainRaw.map(async (stage) => {
            const res = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${stage.name}`
            );
            const data = await res.json();

            return {
              ...stage,
              image:
                data.sprites.other["official-artwork"].front_default ||
                data.sprites.front_default ||
                null,
            };
          })
        );
      })
      .then((evoChain) => {
        setEvolutionChain(evoChain);
      })
      .catch((err) => {
        console.error("Evolution fetch error:", err);
        setEvolutionChain([]);
      });
  }, [selectedPokemon]);

  // Calculate weaknesses when selectedPokemon changes
  useEffect(() => {
    const calculateWeaknesses = async () => {
      if (!selectedPokemon) return;

      const types = selectedPokemon.types.map((t) => t.type.name);
      const effectiveness = {};
      const allTypes = [
        "normal",
        "fire",
        "water",
        "electric",
        "grass",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy",
      ];

      allTypes.forEach((t) => (effectiveness[t] = 1));

      const typeData = await Promise.all(
        types.map((t) =>
          fetch(`https://pokeapi.co/api/v2/type/${t}`).then((res) => res.json())
        )
      );

      typeData.forEach((type) => {
        type.damage_relations.double_damage_from.forEach(({ name }) => {
          effectiveness[name] *= 2;
        });
        type.damage_relations.half_damage_from.forEach(({ name }) => {
          effectiveness[name] *= 0.5;
        });
        type.damage_relations.no_damage_from.forEach(({ name }) => {
          effectiveness[name] *= 0;
        });
      });

      const result = Object.entries(effectiveness)
        .filter(([_, multiplier]) => multiplier > 1)
        .sort((a, b) => b[1] - a[1]);

      setWeaknesses(result);
    };

    calculateWeaknesses();
  }, [selectedPokemon]);

  function getGeneration(id) {
    if (id >= 1 && id <= 151) return "1";
    if (id >= 152 && id <= 251) return "2";
    if (id >= 252 && id <= 386) return "3";
    if (id >= 387 && id <= 493) return "4";
    if (id >= 494 && id <= 649) return "5";
    if (id >= 650 && id <= 721) return "6";
    if (id >= 722 && id <= 809) return "7";
    if (id >= 810 && id <= 905) return "8";
    if (id >= 906 && id <= 1025) return "9";
    return "";
  }

  // Filter Pokémon by search, range, generation, etc.
  const filteredPokemon = pokemonDetails.filter((p) => {
    const nameMatch = p.name.includes(searchQuery);
    const inRange =
      (!range.from || p.id >= parseInt(range.from)) &&
      (!range.to || p.id <= parseInt(range.to));
    const matchesGen = !selectedGen || getGeneration(p.id) === selectedGen;

    // You can add other filters here for type, weaknesses, abilities, height, weight if you implement them

    return nameMatch && inRange && matchesGen;
  });

  // Sort filtered list
  let sorted = [...filteredPokemon];
  if (sortOption === "asc") sorted.sort((a, b) => a.id - b.id);
  else if (sortOption === "desc") sorted.sort((a, b) => b.id - a.id);
  else if (sortOption === "az")
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortOption === "za")
    sorted.sort((a, b) => b.name.localeCompare(a.name));

  // Helpers to navigate previous/next in the filtered sorted list
  const selectedIndex = sorted.findIndex((p) => p.id === selectedPokemonId);

  const statLabels = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SpA",
    "special-defense": "SpD",
    speed: "SPD",
  };

  if (loading)
    return (
      <div className="message-container">
        <div className="loading">
          <p>Loading Pokémon — please wait...</p>
          <img src={loadingGif} alt="loading" width={"100px"} />
        </div>
        <div className="pokemon-info-container">
          <img
            src="https://clipart-library.com/images/8iEnXgria.jpg"
            alt="Unknown Pokémon"
            className="pkmn-img-side"
            style={{ borderRadius: "200px" }}
          />
          <br />
          <p className="no-selection">Click a Pokémon to see details here</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="message-container">
        <p>Error: {error}</p>
        <div className="pokemon-info-container">
          <img
            src="https://clipart-library.com/images/8iEnXgria.jpg"
            alt="Unknown Pokémon"
            className="pkmn-img-side"
            style={{ borderRadius: "200px" }}
          />
          <br />
          <p className="no-selection">Click a Pokémon to see details here</p>
        </div>
      </div>
    );

  return (
    <div className="pokedex">
      {/* Left list */}
      <div className="left">
        <div className="filters">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="search-bar"
          />

          <div className="sort-and-range">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-dropdown"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>

            <div className="range-filter">
              <label>
                from
                <input
                  type="text"
                  placeholder="1"
                  value={range.from}
                  onChange={(e) => setRange({ ...range, from: e.target.value })}
                  className="range"
                />
              </label>
              <label>
                to
                <input
                  type="text"
                  placeholder="1025"
                  value={range.to}
                  onChange={(e) => setRange({ ...range, to: e.target.value })}
                  className="range"
                />
              </label>
            </div>
          </div>

          <div className="drop-filters">
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="gen-sort"
            >
              <option value="">Gen</option>
              <option value="1">Gen 1</option>
              <option value="2">Gen 2</option>
              <option value="3">Gen 3</option>
              <option value="4">Gen 4</option>
              <option value="5">Gen 5</option>
              <option value="6">Gen 6</option>
              <option value="7">Gen 7</option>
              <option value="8">Gen 8</option>
              <option value="9">Gen 9</option>
            </select>
            {/* Reset Button */}
            <button
              className="reset-button"
              onClick={() => {
                setSearchQuery("");
                setSortOption("asc");
                setRange({ from: "", to: "" });
                setSelectedGen("");
                setSelectedType("");
                setSelectedWeakness("");
                setSelectedAbility("");
                setSelectedHeight("");
                setSelectedWeight("");
                setSelectedPokemonId(null);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="pokemon-list-container">
          {sorted.map((data) => (
            <div
              key={data.id}
              className={`pkmn ${
                selectedPokemonId === data.id ? "selected" : ""
              }`}
              onClick={() => setSelectedPokemonId(data.id)}
            >
              <img
                src={
                  data.sprites.versions["generation-v"]["black-white"].animated
                    .front_default || data.sprites.front_default
                }
                alt={data.name}
                className="pkmn-img"
              />
              <div className="pkmn-number">
                N&deg;{data.id.toString().padStart(4, "0")}
              </div>
              <div className="pkmn-name">{data.name}</div>

              <div className="pkmn-types">
                {data.types.map((t) => (
                  <span key={t.type.name} className={`type-box ${t.type.name}`}>
                    {t.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right preview */}
      <div className="pokemon-info-container">
        {!selectedPokemon ? (
          <>
            <img
              src="https://clipart-library.com/images/8iEnXgria.jpg"
              alt="Unknown Pokémon"
              className="pkmn-img-side"
              style={{ borderRadius: "200px" }}
            />
            <br />
            <p className="no-selection">Click a Pokémon to see details here</p>
          </>
        ) : (
          <>
            <img
              src={
                selectedPokemon.sprites.other["official-artwork"]
                  .front_default || selectedPokemon.sprites.front_default
              }
              alt={selectedPokemon.name}
              className="pkmn-img-side"
            />
            <p className="side-id">
              #{selectedPokemon.id.toString().padStart(4, "0")}
            </p>
            <h2 className="side-name">{selectedPokemon.name}</h2>
            <p className="side-species">{speciesGenus}</p>
            <div className="pkmn-types">
              {selectedPokemon.types.map((t) => (
                <span key={t.type.name} className={`type-box ${t.type.name}`}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="entry">
              <strong className="info-title">POKÉDEX ENTRY</strong>
              <p className="entry-text">{flavorText}</p>
            </div>

            <div>
              <strong className="info-title">ABILITIES</strong>
              <br />
              <div className="abilities">
                {selectedPokemon.abilities.map((a) => (
                  <span
                    className={`ability ${a.is_hidden ? "hidden-ability" : ""}`}
                    key={a.ability.name}
                  >
                    {a.ability.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="information">
              <p>
                <strong className="info-title">HEIGHT</strong>
                <br />
                <div className="info">{selectedPokemon.height}</div>
              </p>
              <p>
                <strong className="info-title">WEIGHT</strong> <br />{" "}
                <div className="info">{selectedPokemon.weight}</div>
              </p>

              <div>
                <strong className="info-title">WEAKNESSES</strong>
                <div className="info weakness">
                  {weaknesses.map(([type, multiplier]) => (
                    <div key={type} className="icon">
                      <img
                        src={
                          typeIcons[
                            type.charAt(0).toUpperCase() + type.slice(1)
                          ]
                        }
                        alt={type}
                        width={"20px"}
                        className="weakness-icon"
                      />
                      {multiplier > 2 && (
                        <span className="multiplier-label">{multiplier}×</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p>
                <strong className="info-title">BASE EXP</strong> <br />
                <div className="info">{selectedPokemon.base_experience}</div>
              </p>
            </div>

            <strong className="info-title">STATS</strong>
            <div className="stats">
              {selectedPokemon.stats.map((s) => (
                <div className="stat-column" key={s.stat.name}>
                  <div className={`stat-circle ${s.stat.name}`}>
                    <span className="stat-name">{statLabels[s.stat.name]}</span>
                  </div>
                  <span className="stat-value">{s.base_stat}</span>
                </div>
              ))}
              <div className="stat-column total-column">
                <div className="stat-circle total">
                  <span className="stat-name">TOT</span>
                </div>
                <span className="stat-value">
                  {selectedPokemon.stats.reduce(
                    (sum, s) => sum + s.base_stat,
                    0
                  )}
                </span>
              </div>
            </div>

            {evolutionChain.length > 0 && (
              <>
              <strong className="info-title">EVOLUTION</strong>
              <div
                className="evolution-chain"
              >
                {evolutionChain.map((evo, index) => (
                  <React.Fragment key={evo.name}>
                    <img
                      src={evo.image}
                      alt={evo.name}
                      className="evo-img"
                    />
                    {/* show level after this image except the last one */}
                    {index < evolutionChain.length - 1 && (
                      <span
                        className="evo-level"
                      >
                        Lvl {evolutionChain[index + 1].min_level || "?"}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              </>
            )}

            <div className="nav-buttons">
              {/* Previous Button */}
              <div
                className="nav"
                onClick={() => {
                  if (selectedIndex === -1) return;
                  const prevIndex =
                    (selectedIndex - 1 + sorted.length) % sorted.length;
                  setSelectedPokemonId(sorted[prevIndex].id);
                }}
              >
                {"<"}
                {(() => {
                  if (selectedIndex === -1) return null;
                  const prevIndex =
                    (selectedIndex - 1 + sorted.length) % sorted.length;
                  const prevPokemon = sorted[prevIndex];
                  return (
                    <>
                      <img
                        src={
                          prevPokemon.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.front_default ||
                          prevPokemon.sprites.front_default
                        }
                        width={"15%"}
                        className="prev"
                      />
                      <p className="mName">{prevPokemon.name}</p>{" "}
                      <p className="mID">
                        &nbsp;#{prevPokemon.id.toString().padStart(4, "0")}
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Next Button */}
              <div
                className="nav"
                onClick={() => {
                  if (selectedIndex === -1) return;
                  const nextIndex = (selectedIndex + 1) % sorted.length;
                  setSelectedPokemonId(sorted[nextIndex].id);
                }}
              >
                {(() => {
                  if (selectedIndex === -1) return null;
                  const nextIndex = (selectedIndex + 1) % sorted.length;
                  const nextPokemon = sorted[nextIndex];
                  return (
                    <>
                      <p className="mID">
                        #{nextPokemon.id.toString().padStart(4, "0")}&nbsp;
                      </p>{" "}
                      <p className="mName">{nextPokemon.name}</p>
                      <img
                        src={
                          nextPokemon.sprites.versions["generation-v"][
                            "black-white"
                          ].animated.front_default ||
                          nextPokemon.sprites.front_default
                        }
                        width={"15%"}
                        className="next"
                      />
                      {">"}
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PokemonList;
