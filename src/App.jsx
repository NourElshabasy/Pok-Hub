import { useState } from "react";
import { Link } from "react-router";
import "./App.css";
import beach from "./assets/beachPKMN.gif";
import beach2 from "./assets/beachPKMN2.gif";
import NavBar from "./components/NavBar";
import WebFooter from "./components/WebFooter";
import FeaturedPokemon from "./components/home-page/FeaturedPokemon";

import mega from "./assets/Blaziken_Mega_Evolution.png";
import shinyRay from "./assets/Rayquaza-Shiny.png";
import megaCharizardX from "./assets/megaCharizardX.png";
import megaCharizardY from "./assets/megaCharizardY.png";
import megaGyra from "./assets/megaGyra.png";
import megaLucario from "./assets/megaLucario.png";

function App() {
  return (
    <>
      <NavBar isHome={true} />
      <img src={beach} alt="" className="beach" />
      <div className="home">
        <div className="home-main">
          <h1 className="home-title">
            PokéHub - The Pokémon Tool for Every Trainer
          </h1>
          <h3>
            Search and explore every Pokémon, learn their strengths, and create
            the ultimate team - all in one place.
          </h3>
        </div>
        <h1>What is PokéHub?</h1>
        <div className="description">
          <p>PokéHub is your all-in-one Pokémon companion.</p>
          <p>
            Whether you’re looking up stats, checking type matchups, or building
            your dream team, PokéHub gives you the tools to train smarter and
            battle better. Perfect for casual fans and competitive trainers
            alike.
          </p>
        </div>
        <hr className="line" />
        <div className="feature">
          <div className="feature-text-left">
            <h1>Build Your Squad</h1>
            <p>
              Catch, collect, and showcase your favorite Pokémon in your
              personal PokéHub collection. From the smallest Caterpie to the
              mightiest Garchomp, every Pokémon you add will display its unique
              type, stats, and abilities. Watch your collection grow as you
              discover new Pokémon and track your Pokédex progress in real time.
            </p>
          </div>
          <img src={megaCharizardX} alt="" height={400} />
        </div>
        <hr className="line" />
        <div className="feature">
          <img src={megaGyra} alt="" height={400} />
          <div className="feature-text-right">
            <h1>Smooth Navigation</h1>
            <p>
              PokéHub’s clean and organized interface keeps all your Pokémon
              info just a click away. View detailed stats, weaknesses, and type
              matchups instantly. Browse through your Pokémon’s moves,
              evolutions, and forms with ease — all while enjoying a visually
              polished experience designed for trainers of all levels.
            </p>
          </div>
        </div>
        <hr className="line" />
        <div className="feature">
          <div className="feature-text-left">
            <h1>Make It Yours</h1>
            <p>
              PokéHub is built for customization. Sort and filter your Pokémon
              however you like — by type, region, number, or even personal
              favorites. Add your own notes, create themed teams, and
              personalize your viewing experience so your PokéHub truly feels
              like home.
            </p>
          </div>
          <img src={megaLucario} alt="" height={400} />
        </div>
      </div>
      <hr className="line" />
      <FeaturedPokemon />
      <WebFooter />
    </>
  );
}

export default App;
