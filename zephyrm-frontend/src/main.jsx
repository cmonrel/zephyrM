/**
 * Main Component
 *
 * This component represents the main entry point for the application.
 *
 * @module main
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ZephyrMApp } from "./ZephyrMApp";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ZephyrMApp />
  // </StrictMode>
);
