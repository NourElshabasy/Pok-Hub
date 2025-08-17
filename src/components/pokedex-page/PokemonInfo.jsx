import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import "./PokemonInfo.css";
import pokemonData from "../../data/pokemonData.json";
import typeChart from "../../data/typeChart.json";

import shinyOff from "../../assets/shinyOff.png";
import shinyOn from "../../assets/shinyOn.png";

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

function calculateWeaknessesArray(types, chart) {
  const allTypes = Object.keys(chart);
  const multipliers = {};

  allTypes.forEach((type) => {
    multipliers[type] = 1;
  });

  types.forEach((pokemonType) => {
    const effectiveness = chart[pokemonType.toLowerCase()];
    if (!effectiveness) return;

    effectiveness.double_damage_from.forEach((type) => {
      multipliers[type] *= 2;
    });
    effectiveness.half_damage_from.forEach((type) => {
      multipliers[type] *= 0.5;
    });
    effectiveness.no_damage_from.forEach((type) => {
      multipliers[type] *= 0;
    });
  });

  // Return as array of [type, multiplier], filtering multiplier > 1 (weakness)
  return Object.entries(multipliers).filter(([_, mult]) => mult > 1);
}

const PokemonInfo = ({ selected, setSelected }) => {
  const { id } = useParams();

  useEffect(() => {
    if (selected?.id) {
      window.history.replaceState({}, "", `/pokedex/${selected.id}`);
    }
  }, [selected]);

  useEffect(() => {
    if (id) {
      setSelected(pokemonData[id - 1]); // Could fetch the Pokémon here
    }
  }, [id]);

  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    preloadImage(Bug);
    preloadImage(Dark);
    preloadImage(Dragon);
    preloadImage(Electric);
    preloadImage(Fairy);
    preloadImage(Fighting);
    preloadImage(Fire);
    preloadImage(Flying);
    preloadImage(Ghost);
    preloadImage(Grass);
    preloadImage(Ground);
    preloadImage(Ice);
    preloadImage(Normal);
    preloadImage(Poison);
    preloadImage(Psychic);
    preloadImage(Rock);
    preloadImage(Steel);
    preloadImage(Water);
    preloadImage(shinyOff);
    preloadImage(shinyOn);
  }, []);

  const heightToFeetInches = (heightDecimeters) => {
    const totalInches = heightDecimeters * 3.937; // 1 decimeter = 3.937 inches
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches.toString().padStart(2, "0")}"`;
  };

  const weightToPounds = (weightHectograms) => {
    const pounds = weightHectograms * 0.220462; // 1 hectogram = 0.220462 pounds
    return pounds.toFixed(1); // 1 decimal place
  };

  const currentIndex = pokemonData.findIndex((p) => p.id === selected.id);
  const prevIndex =
    (currentIndex - 1 + pokemonData.length) % pokemonData.length;
  const nextIndex = (currentIndex + 1) % pokemonData.length;

  const handlePrev = () => {
    setSelected(pokemonData[prevIndex]);
  };

  const handleNext = () => {
    setSelected(pokemonData[nextIndex]);
  };

  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    setSelectedForm(null);
  }, [selected]);

  const displayData = selectedForm
    ? selected.forms?.find((f) => f.form === selectedForm) || selected
    : selected;

  const [fadeOut, setFadeOut] = useState(false);
  const [fadeData, setFadeData] = useState(displayData);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    setFadeOut(true); // start fade out

    const timeout = setTimeout(() => {
      setFadeData(displayData); // update content after fade out
      setFadeOut(false); // fade back in
    }, 200); // match your CSS duration

    return () => clearTimeout(timeout);
  }, [displayData, selected]);

  const [imageFadeOut, setImageFadeOut] = useState(false);

  useEffect(() => {
    setImageFadeOut(true);

    const timeout = setTimeout(() => {
      setFadeData(displayData);
      setImageFadeOut(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [displayData, isShiny]);

  return (
    <div className="pokemon-info-container">
      <div className={`fade-info-container ${fadeOut ? "fade-out" : ""}`}>
        {selected.forms && selected.forms.length > 0 && (
          <div>
            <select
              id="form-select"
              value={selectedForm || ""}
              onChange={(e) =>
                setSelectedForm(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">Default</option>
              {selected.forms.map((form) => (
                <option key={form.form} value={form.form}>
                  {form.form
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        )}

        <img
          src={isShiny ? fadeData.sprite_art_shiny : fadeData.sprite_art}
          alt={fadeData.name}
          className={`pkmn-img-side ${imageFadeOut ? "fade-out" : ""}`}
        />

        <img
          onClick={() => setIsShiny((prev) => !prev)}
          className="shiny-toggle-btn"
          src={isShiny ? shinyOn : shinyOff}
        />

        <p className="side-id">#{selected.id?.toString().padStart(4, "0")}</p>
        <h2 className="side-name">{fadeData.name.replace(/-/g, " ")}</h2>
        <p className="side-species">{fadeData.species}</p>

        <div className="pkmn-types">
          {fadeData.types.map((type) => (
            <span key={type} className={`type-box ${type}`}>
              {type.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="entry">
          <strong className="info-title">POKÉDEX ENTRY</strong>
          <p className="entry-text">{fadeData.pokedex_entry}</p>
        </div>

        <div>
          <strong className="info-title">ABILITIES</strong>
          <br />
          <div className="abilities">
            {fadeData.abilities.map((ability, idx) => (
              <span className="ability" key={idx}>
                {ability}
              </span>
            ))}
          </div>
        </div>

        <div className="information">
          {/* HEIGHT */}
          <div>
            <strong className="info-title">HEIGHT</strong>
            <div className="info">{heightToFeetInches(fadeData.height)}</div>
          </div>

          {/* WEIGHT */}
          <div>
            <strong className="info-title">WEIGHT</strong>
            <div className="info">{weightToPounds(fadeData.weight)} lbs</div>
          </div>

          {/* WEAKNESSES */}
          <div>
            <strong className="info-title">WEAKNESSES</strong>
            <div className="info weakness">
              {calculateWeaknessesArray(fadeData.types, typeChart).map(
                ([type, multiplier]) => (
                  <div key={`${type}-${multiplier}`} className="icon">
                    <img
                      src={
                        typeIcons[type.charAt(0).toUpperCase() + type.slice(1)]
                      }
                      alt={type}
                      width="20px"
                      className="weakness-icon"
                    />
                    {multiplier > 2 && (
                      <span className="multiplier-label">{multiplier}×</span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* BASE EXP */}
          <div>
            <strong className="info-title">BASE EXP</strong>
            <div className="info">{fadeData.base_experience}</div>
          </div>
        </div>

        <strong className="info-title">STATS</strong>
        <div className="stats">
          {fadeData.stats.map((stat) => (
            <div className="stat-column" key={stat.name}>
              <div className={`stat-circle ${stat.name}`}>
                <span className="stat-name">{stat.name}</span>
              </div>
              <span className="stat-value">{stat.base}</span>
            </div>
          ))}
        </div>

        <strong className="info-title">EVOLUTION</strong>
        <div className="evolution-chain">
          {fadeData.evolution_chain.map((evo, index) => {
            // Try to find the Pokémon by base name first
            let evoPoke = pokemonData.find((p) => p.name === evo);

            // If not found, try to find a form with that name
            if (!evoPoke) {
              evoPoke = pokemonData.find((p) =>
                p.forms?.some((form) => form.name === evo)
              );
              // If found in forms, get that form object
              if (evoPoke) {
                evoPoke = evoPoke.forms.find((form) => form.name === evo);
              }
            }

            if (!evoPoke) return null; // or placeholder if you want

            return (
              <img
                key={index}
                className="evo-img"
                src={evoPoke.sprite_art}
                alt={evo}
              />
            );
          })}
        </div>

        {/* Nav buttons as you had */}
        <div className="nav-buttons">
          {/* Previous */}
          <div className="nav" onClick={handlePrev}>
            &larr;
            <img
              src={pokemonData[prevIndex].sprite_bw}
              alt={pokemonData[prevIndex].name}
              height="20px"
              className="prev"
            />
            <p className="mID">
              #{pokemonData[prevIndex].id.toString().padStart(4, "0")}&nbsp;
            </p>
            <p className="mName">{pokemonData[prevIndex].name}</p>
          </div>

          {/* Next */}
          <div className="nav" onClick={handleNext}>
            <p className="mID">
              #{pokemonData[nextIndex].id.toString().padStart(4, "0")}&nbsp;
            </p>
            <p className="mName">{pokemonData[nextIndex].name}</p>
            <img
              src={pokemonData[nextIndex].sprite_bw}
              alt={pokemonData[nextIndex].name}
              height="20px"
              className="next"
            />
            &rarr;
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonInfo;
