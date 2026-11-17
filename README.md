# Rooftop Gardening Simulation Lab
React + Vite + Chart.js educational virtual lab (11 modules). Runs offline after `npm install`; no login, backend or API keys.

## Run on a laptop (Windows/Mac/Linux)
1. Install Node.js 18+ from nodejs.org.
2. Extract the ZIP. In VS Code: File > Open Folder > `rooftop-gardening-lab`.
3. Open the terminal (Ctrl+`) and run:
   `npm install`
   `npm run dev`
4. Open http://localhost:5173 in Chrome.
Optional: `npm run build` makes a production build in `dist/`.

## Modules
1 Introduction · 2 Site Assessment · 3 Meteorological Lab (rain gauge, wet/dry bulb, wind vane) · 4 Growing Media · 5 Seed Lab · 6 Main Simulation (plus A/B compare) · 7 Calculations (9 calculators) · 8 Garden Planner · 9 Practicals (10) · 10 Case Studies (5) · 11 Quiz · 12 Report (print / CSV).

## Simulation style
Experiments follow the TerraLab pattern: procedure steps with an Advance Procedure Step button, a dark apparatus panel with digital readouts, zone-labelled sliders, a diagnosis card and Reset & Repeat. Completing a procedure adds to Lab Mastery in the header.
Deep link to an experiment tab: `?m=5&x=4`.

## Code layout
`src/lib/model.js` holds the growth model and all formulas (no UI). `src/components/` holds the screens. `src/styles/app.css` holds the theme.

## Honest notes
- Growth coefficients are assumed teaching values; results are simulated estimates, not harvest predictions.
- Germination data are sample values. Case studies are illustrative.
- Site and load scores never replace a structural engineer's approval.
- Progress and quiz score are saved in the browser (localStorage). Use Reset in the header to clear.
- Deep link to a module: `http://localhost:5173/?m=5` (0–10).
