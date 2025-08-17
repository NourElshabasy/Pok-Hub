import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Pokedex from "./pages/Pokedex.jsx";
import TeamBuilder from "./pages/TeamBuilder.jsx";
import News from "./pages/News.jsx";
import Forum from "./pages/Forum.jsx";
import NoMatch from "./pages/NoMatch.jsx";

import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokedex/:id" element={<Pokedex />} />
        <Route path="/team-builder" element={<TeamBuilder />} />
        <Route path="/news" element={<News />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="*" element={<NoMatch />} />
        <Route path="/pokedex/*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
