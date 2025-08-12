import React from "react";
import NavBar from "../components/NavBar";

const TeamBuilder = () => {
  return (
    <div>
      <NavBar isTeamBuilder={true} />
      <h1>TeamBuilder</h1>
    </div>
  );
};

export default TeamBuilder;
