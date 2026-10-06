import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Player from "./components/Player";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Player />
  </StrictMode>,
);
