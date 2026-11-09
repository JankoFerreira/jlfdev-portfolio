import { createRoot } from "react-dom/client";
import "../css/base.css";
import "../css/navbar.css";
import "../css/hero.css";
import "../css/sections.css";
import "../css/contact.css";
import "../css/portfolio.css";
import "../css/skills-globe.css";
import "./performance.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
