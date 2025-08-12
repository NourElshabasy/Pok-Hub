import React from "react";
import "./WebFooter.css";

const WebFooter = () => {
  return (
    <>
      <div className="footerImg"></div>
      <div className="footer">
        <p>© 2025 PokéHub.com</p>
        <p>
          Pokémon is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc.
        </p>
        <p>
          Data sourced from the <a href="https://pokeapi.co/">PokéAPI</a>
        </p>
      </div>
    </>
  );
};

export default WebFooter;
