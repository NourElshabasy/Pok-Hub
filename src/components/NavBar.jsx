import React from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { useState } from "react";
import "./NavBar.css";

import homeFalse from "../assets/nav-icons/HomeIcon-0.png";
import homeTrue from "../assets/nav-icons/HomeIcon-1.png";
import pokedexFalse from "../assets/nav-icons/PokedexIcon-0.png";
import pokedexTrue from "../assets/nav-icons/PokedexIcon-1.png";
import teamBuilderFalse from "../assets/nav-icons/TeamBuilderIcon-0.png";
import teamBuilderTrue from "../assets/nav-icons/TeamBuilderIcon-1.png";
import newsFalse from "../assets/nav-icons/NewsIcon-0.png";
import newsTrue from "../assets/nav-icons/NewsIcon-1.png";
import aboutFalse from "../assets/nav-icons/AboutIcon-0.png";
import aboutTrue from "../assets/nav-icons/AboutIcon-1.png";
import forumFalse from "../assets/nav-icons/Forum-0.png";
import forumTrue from "../assets/nav-icons/Forum-1.png";


const NavBar = ({ isHome, isPokedex, isTeamBuilder, isForum, isNews}) => {
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    preloadImage(homeFalse);
    preloadImage(homeTrue);
    preloadImage(pokedexFalse);
    preloadImage(pokedexTrue);
    preloadImage(teamBuilderFalse);
    preloadImage(teamBuilderTrue);
    preloadImage(newsFalse);
    preloadImage(newsTrue);
    preloadImage(aboutFalse);
    preloadImage(aboutTrue);
    preloadImage(forumFalse);
    preloadImage(forumTrue);
  }, []);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return; // Only apply on home page

    const handleScroll = () => {
      if (window.scrollY > 500) {
        // change 100 to whatever scroll distance you want
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);
  return (
    <div className={`nav-bar ${isHome && !scrolled ? "transparent" : "solid"}`}>
      <Link to="/">
        <div className={`page ${isHome ? "page-active" : ""}`}>
          <img
            src={isHome ? homeTrue : homeFalse}
            alt="homeIcon"
            width={"30px"}
          />
          PokéHub
        </div>
      </Link>
      <Link to="/pokedex/1">
        <div className={`page ${isPokedex ? "page-active" : ""}`}>
          <img
            src={isPokedex ? pokedexTrue : pokedexFalse}
            alt="pokedexIcon"
            width={"35px"}
          />
          Pokédex
        </div>
      </Link>
      <Link to="/team-builder">
        <div className={`page ${isTeamBuilder ? "page-active" : ""}`}>
          <img
            src={isTeamBuilder ? teamBuilderTrue : teamBuilderFalse}
            alt="teamBuilderIcon"
            width={"30px"}
          />
          TeamBuilder
        </div>
      </Link>
      <Link to="/forum">
        <div className={`page ${isForum ? "page-active" : ""}`}>
          <img
            src={isForum ? forumTrue : forumFalse}
            alt="forumIcon"
            width={"34px"}
          />
          Forum
        </div>
      </Link>
      <Link to="/news">
        <div className={`page ${isNews ? "page-active" : ""}`}>
          <img
            src={isNews ? newsTrue : newsFalse}
            alt="newsIcon"
            width={"28px"}
          />
          News
        </div>
      </Link>
    </div>
  );
};

export default NavBar;
