// fetchPokemonDataSpeciesIncremental.mjs
import fs from "fs/promises";
import path from "path";

const POKEAPI = "https://pokeapi.co/api/v2";
const OUTPUT_DIR = path.join(process.cwd(), "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pokemonData1.json");

// Polyfill fetch if needed
if (!globalThis.fetch) {
  try {
    const mod = await import("node-fetch");
    globalThis.fetch = mod.default;
  } catch (err) {
    console.error("Fetch not available. Run on Node 18+ or install node-fetch");
    process.exit(1);
  }
}

async function fetchJSON(url, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 250 * i));
    }
  }
}

function friendlyStatName(apiName) {
  const map = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SpA",
    "special-defense": "SpD",
    "speed": "SPD"
  };
  return map[apiName] ?? apiName.toUpperCase();
}

function buildSprites(sprites) {
  const animatedBW = sprites?.versions?.["generation-v"]?.["black-white"]?.animated ?? {};
  const official = sprites?.other?.["official-artwork"] ?? {};

  return {
    sprite_bw: animatedBW.front_default ?? sprites?.front_default ?? null,
    sprite_bw_shiny: animatedBW.front_shiny ?? sprites?.front_shiny ?? null,
    sprite_bw_female: animatedBW.front_female ?? sprites?.front_female ?? null,
    sprite_bw_female_shiny: animatedBW.front_shiny_female ?? sprites?.front_shiny_female ?? null,
    sprite_art: official.front_default ?? sprites?.front_default ?? null,
    sprite_art_shiny: official.front_shiny ?? sprites?.front_shiny ?? null
  };
}

function buildStatsArray(statsArray) {
  const formatted = statsArray.map(s => ({
    name: friendlyStatName(s.stat.name),
    base: s.base_stat
  }));
  const bst = formatted.reduce((sum, s) => sum + s.base, 0);
  formatted.push({ name: "BST", base: bst });
  return formatted;
}

function collectEvolutionNames(chainNode, acc = []) {
  if (!chainNode) return acc;
  acc.push(chainNode.species.name);
  for (const child of chainNode.evolves_to || []) {
    collectEvolutionNames(child, acc);
  }
  return acc;
}

async function buildSpeciesEntry(speciesEntry) {
  try {
    const speciesData = await fetchJSON(speciesEntry.url);

    const defaultVariety = speciesData.varieties.find(v => v.is_default) ?? speciesData.varieties[0];
    if (!defaultVariety) throw new Error("No default variety found");

    const defaultPokemon = await fetchJSON(defaultVariety.pokemon.url);
    const evoData = await fetchJSON(speciesData.evolution_chain.url);
    const baseEvolutionNames = collectEvolutionNames(evoData.chain);

    const pokedexEntry = speciesData.flavor_text_entries?.find(f => f.language?.name === "en")?.flavor_text?.replace(/[\n\f]/g, " ") ?? "";
    const genus = speciesData.genera?.find(g => g.language?.name === "en")?.genus ?? "";

    const baseSprites = buildSprites(defaultPokemon.sprites);
    const baseStats = buildStatsArray(defaultPokemon.stats);
    const baseObj = {
      id: defaultPokemon.id,
      name: defaultPokemon.name,
      types: defaultPokemon.types.map(t => t.type.name),
      ...baseSprites,
      stats: baseStats,
      height: defaultPokemon.height,
      weight: defaultPokemon.weight,
      base_experience: defaultPokemon.base_experience,
      abilities: defaultPokemon.abilities.map(a => a.ability.name),
      species: genus,
      pokedex_entry: pokedexEntry,
      evolution_chain: baseEvolutionNames,
      forms: []
    };

    // Loop over speciesData.varieties for forms (skip default)
    for (const variety of speciesData.varieties) {
      if (variety.is_default) continue;

      try {
        const formPokemon = await fetchJSON(variety.pokemon.url);
        const formSpeciesData = await fetchJSON(formPokemon.species.url);

        // Build form-specific evolution chain: replace base species name with form name
        const formEvolutionChain = baseEvolutionNames.map(n => n === speciesData.name ? formPokemon.name : n);

        // Derive form label by removing species name prefix if present
        let formLabel = formPokemon.name.startsWith(`${speciesData.name}-`)
          ? formPokemon.name.slice(speciesData.name.length + 1)
          : formPokemon.name;

        const formSprites = buildSprites(formPokemon.sprites);
        const formStats = buildStatsArray(formPokemon.stats);
        const formGenus = formSpeciesData.genera?.find(g => g.language?.name === "en")?.genus ?? genus;
        const formPokedex = formSpeciesData.flavor_text_entries?.find(f => f.language?.name === "en")?.flavor_text?.replace(/[\n\f]/g, " ") ?? pokedexEntry;

        baseObj.forms.push({
          form: formLabel,
          name: formPokemon.name,
          types: formPokemon.types.map(t => t.type.name),
          ...formSprites,
          stats: formStats,
          height: formPokemon.height,
          weight: formPokemon.weight,
          base_experience: formPokemon.base_experience,
          abilities: formPokemon.abilities.map(a => a.ability.name),
          species: formGenus,
          pokedex_entry: formPokedex,
          evolution_chain: formEvolutionChain
        });
      } catch (formErr) {
        console.warn(`  ⚠ Failed to fetch form ${variety.pokemon.name}: ${formErr.message || formErr}`);
      }
    }

    return baseObj;

  } catch (err) {
    console.error(`Error building species ${speciesEntry.name}:`, err);
    return null;
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Fetching species list...");
  const speciesListResp = await fetchJSON(`${POKEAPI}/pokemon-species?limit=2000`);
  const speciesList = speciesListResp.results;

  console.log(`Total species to process: ${speciesList.length}`);

  const results = [];
  let processed = 0;

  for (const speciesEntry of speciesList) {
    processed++;
    console.log(`Fetching (${processed}/${speciesList.length}): ${speciesEntry.name}`);
    const entry = await buildSpeciesEntry(speciesEntry);
    if (entry) results.push(entry);
  }

  console.log(`Saving ${results.length} Pokémon species to file...`);
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");
  console.log(`✅ Saved to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
