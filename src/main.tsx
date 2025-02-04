import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/main.css";
import "./css/main.body.css";
import "./css/main.basicElements.css";
import "./css/main.varibles.css";
import App from "./components/App/App.tsx";

const root = createRoot(document.getElementById("root")!);

export default function load(){
    root.render(<StrictMode><App /></StrictMode>);
}
load();