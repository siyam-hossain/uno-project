/* =====================================================
   diagrams.js — SVG state machine & sensor diagrams
   FireBot R1 Documentation
   ===================================================== */

(function () {
  'use strict';

  /* ── STATE MACHINE DIAGRAM ── */
  function buildStateDiagram() {
    const container = document.getElementById('state-diagram');
    if (!container) return;

    const svg = `
<svg viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;padding:1rem;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4d5f73"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
      markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#39d98a"/>
    </marker>
  </defs>

  <!-- IDLE -->
  <rect x="10" y="75" width="110" height="50" rx="8" fill="#1a2130" stroke="#2a3441" stroke-width="1.5"/>
  <text x="65" y="96" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">IDLE</text>
  <text x="65" y="111" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">No fire</text>

  <!-- Arrow: IDLE -> NAVIGATE -->
  <line x1="120" y1="100" x2="175" y2="100" stroke="#4d5f73" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="147" y="93" text-anchor="middle" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">fire!</text>

  <!-- NAVIGATE -->
  <rect x="178" y="75" width="120" height="50" rx="8" fill="#1a2130" stroke="#2a3441" stroke-width="1.5"/>
  <text x="238" y="96" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">NAVIGATE</text>
  <text x="238" y="111" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">fwd / turn</text>

  <!-- Arrow: NAVIGATE -> OBSTACLE -->
  <path d="M238,75 Q238,30 348,30 Q460,30 460,75" stroke="#4d5f73" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>
  <text x="349" y="22" text-anchor="middle" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">obstacle &lt; 20cm</text>

  <!-- OBSTACLE -->
  <rect x="396" y="75" width="130" height="50" rx="8" fill="#1a2130" stroke="#2a3441" stroke-width="1.5"/>
  <text x="461" y="96" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="10" font-weight="600">AVOID</text>
  <text x="461" y="111" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">scan + evade</text>

  <!-- Arrow: OBSTACLE -> NAVIGATE -->
  <path d="M461,125 Q461,165 349,165 Q238,165 238,125" stroke="#4d5f73" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>
  <text x="349" y="178" text-anchor="middle" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">clear</text>

  <!-- Arrow: NAVIGATE -> EXTINGUISH -->
  <line x1="298" y1="100" x2="540" y2="100" stroke="#39d98a" stroke-width="1.5" marker-end="url(#arrow-green)" stroke-dasharray="5,3"/>
  <text x="430" y="93" text-anchor="middle" fill="#39d98a" font-family="Inter,sans-serif" font-size="8">dist ≤ 15cm</text>

  <!-- EXTINGUISH -->
  <rect x="543" y="65" width="130" height="70" rx="8" fill="#0d1e14" stroke="#39d98a" stroke-width="1.5"/>
  <text x="608" y="90" text-anchor="middle" fill="#39d98a" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700">EXTINGUISH</text>
  <text x="608" y="105" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">aim + pump ON</text>
  <circle cx="608" cy="118" r="4" fill="#39d98a" opacity="0.7"/>

  <!-- Arrow: EXTINGUISH -> IDLE -->
  <path d="M608,65 Q608,20 65,20 L65,75" stroke="#4d5f73" stroke-width="1.5" fill="none" marker-end="url(#arrow)" stroke-dasharray="4,3"/>
  <text x="340" y="14" text-anchor="middle" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">fire out</text>
</svg>`;

    container.innerHTML = svg;
  }

  /* ── SENSOR VISUALIZATION ── */
  function buildSensorDiagram() {
    const container = document.getElementById('sensor-viz');
    if (!container) return;

    const svg = `
<svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;padding:1rem;">
  <!-- Robot body -->
  <rect x="185" y="60" width="130" height="90" rx="10" fill="#1a2130" stroke="#2a3441" stroke-width="2"/>
  <text x="250" y="115" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="9">ROBOT</text>

  <!-- Sensor L -->
  <rect x="100" y="78" width="70" height="36" rx="6" fill="#1c2333" stroke="#2a3441" stroke-width="1.5"/>
  <text x="135" y="93" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="9" font-weight="600">FLAME_L</text>
  <text x="135" y="108" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">A0</text>
  <line x1="170" y1="96" x2="185" y2="96" stroke="#2a3441" stroke-width="1.5"/>

  <!-- Sensor C -->
  <rect x="215" y="20" width="70" height="36" rx="6" fill="#1c2333" stroke="#2a3441" stroke-width="1.5"/>
  <text x="250" y="35" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="9" font-weight="600">FLAME_C</text>
  <text x="250" y="50" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">A1</text>
  <line x1="250" y1="56" x2="250" y2="60" stroke="#2a3441" stroke-width="1.5"/>

  <!-- Sensor R -->
  <rect x="330" y="78" width="70" height="36" rx="6" fill="#1c2333" stroke="#2a3441" stroke-width="1.5"/>
  <text x="365" y="93" text-anchor="middle" fill="#8b9ab0" font-family="JetBrains Mono,monospace" font-size="9" font-weight="600">FLAME_R</text>
  <text x="365" y="108" text-anchor="middle" fill="#4d5f73" font-family="JetBrains Mono,monospace" font-size="8">A2</text>
  <line x1="315" y1="96" x2="330" y2="96" stroke="#2a3441" stroke-width="1.5"/>

  <!-- Detection arcs -->
  <path d="M110,76 Q70,50 80,30" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.5"/>
  <path d="M100,78 Q55,60 65,35" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.3"/>
  <path d="M250,20 Q250,5 250,2" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.5"/>
  <path d="M240,20 Q225,5 230,2" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.3"/>
  <path d="M390,76 Q430,50 420,30" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.5"/>
  <path d="M400,78 Q445,60 435,35" stroke="#f0a030" stroke-width="1" fill="none" stroke-dasharray="3,3" opacity="0.3"/>

  <!-- Threshold label -->
  <rect x="380" y="130" width="110" height="28" rx="5" fill="#1a2130" stroke="#2a3441" stroke-width="1"/>
  <text x="435" y="141" text-anchor="middle" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">THRESHOLD</text>
  <text x="435" y="153" text-anchor="middle" fill="#f0a030" font-family="JetBrains Mono,monospace" font-size="9" font-weight="600">val &lt; 500</text>

  <!-- Label: analog voltage -->
  <text x="12" y="145" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">Lower analog value</text>
  <text x="12" y="158" fill="#4d5f73" font-family="Inter,sans-serif" font-size="8">= stronger IR signal</text>
</svg>`;

    container.innerHTML = svg;
  }

  /* ── INIT ── */
  buildStateDiagram();
  buildSensorDiagram();

})();
