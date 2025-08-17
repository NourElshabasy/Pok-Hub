import React from "react";
import NavBar from "../components/NavBar";
import WebFooter from "../components/WebFooter";
import missingNo from "../assets/MissingNo.png";

const NoMatch = () => {
  return (
    <>
      <NavBar />
      <div className="noMatch">
        <div className="noMatch-text">
          <h1>Page not found! </h1>
          <h3>Wild MissingNo. appeared! But your search didn’t…</h3>
        </div>
        <img src={missingNo} alt="" width={150} />
      </div>
      <WebFooter />
    </>
  );
};

export default NoMatch;
