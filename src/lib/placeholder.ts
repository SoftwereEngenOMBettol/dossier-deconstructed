// Deterministic noir SVG placeholders used when a casepack doesn't ship
// per-item photos. Every section (suspects, witnesses, evidence, crime
// scene, documents, cover) gets themed art with an initial/label + seeded
// accents, so the UI always has imagery.

export type PlaceholderKind =
  | "portrait"
  | "witness"
  | "evidence"
  | "scene"
  | "document"
  | "cover";

function hash(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function encode(svg: string): string {
  const clean = svg.replace(/<\?xml[^>]*\?>/g, "").trim();
  // Base64 for maximum browser compatibility (headless Chromium sometimes
  // rejects URI-encoded SVGs with certain characters).
  if (typeof btoa === "function") {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(clean)))}`;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clean)}`;
}

const NOIR_BG = "#0f0d0a";
const NOIR_MID = "#1a1610";
const GOLD = "#c8a24a";
const GOLD_DEEP = "#8a6a20";
const INK = "#e8dcc0";
const RED = "#a2342a";

function grain(id: string) {
  return `
    <filter id="${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>
      <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0.35 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>`;
}

/** Portrait placeholder — silhouette + initials on aged card. */
function portrait(seed: string, name: string, sub = "", accent = GOLD) {
  const h = hash(seed);
  const hue = h % 360;
  const init = initials(name || seed);
  return encode(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="hsl(${hue},15%,22%)"/>
      <stop offset="60%" stop-color="${NOIR_MID}"/>
      <stop offset="100%" stop-color="${NOIR_BG}"/>
    </radialGradient>
    ${grain("gn")}
  </defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <rect width="400" height="500" fill="url(#g)" filter="url(#gn)" opacity="0.6"/>
  <g opacity="0.35">
    <circle cx="200" cy="200" r="72" fill="#000"/>
    <path d="M80,500 C80,360 140,300 200,300 C260,300 320,360 320,500 Z" fill="#000"/>
  </g>
  <g stroke="${accent}" stroke-width="1" fill="none" opacity="0.6">
    <rect x="14" y="14" width="372" height="472"/>
    <rect x="22" y="22" width="356" height="456"/>
  </g>
  <text x="200" y="215" text-anchor="middle" font-family="Georgia, serif"
    font-size="72" font-weight="700" fill="${accent}" opacity="0.9">${init}</text>
  <text x="200" y="410" text-anchor="middle" font-family="Georgia, serif"
    font-size="16" letter-spacing="4" fill="${INK}" opacity="0.85">${name.toUpperCase().slice(0,28)}</text>
  <text x="200" y="440" text-anchor="middle" font-family="monospace"
    font-size="10" letter-spacing="3" fill="${accent}" opacity="0.7">${sub.toUpperCase().slice(0,36)}</text>
  <text x="200" y="472" text-anchor="middle" font-family="monospace"
    font-size="9" letter-spacing="4" fill="${INK}" opacity="0.4">DOSSIER · X · ARCHIVE</text>
</svg>`);
}

/** Evidence placeholder — index card with tag + hash */
function evidenceCard(seed: string, title: string, type = "Physical") {
  const h = hash(seed);
  const tag = `#${(h % 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
  return encode(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1712"/>
      <stop offset="100%" stop-color="#0b0906"/>
    </linearGradient>
    ${grain("g2")}
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <rect width="400" height="400" fill="url(#g)" filter="url(#g2)" opacity="0.5"/>
  <g transform="translate(60,80) rotate(-3)">
    <rect x="0" y="0" width="280" height="240" fill="#efe6cf" stroke="#8a7a52" stroke-width="1"/>
    <rect x="0" y="0" width="280" height="40" fill="${RED}" opacity="0.85"/>
    <text x="14" y="26" font-family="monospace" font-size="12" letter-spacing="3" fill="#fff">EVIDENCE · ${tag}</text>
    <text x="14" y="76" font-family="Georgia, serif" font-size="18" fill="#1a1610">${title.slice(0,26)}</text>
    <text x="14" y="100" font-family="monospace" font-size="10" letter-spacing="2" fill="#5c4d2d">TYPE — ${type.toUpperCase()}</text>
    <g stroke="#5c4d2d" stroke-width="0.5" opacity="0.5">
      <line x1="14" y1="120" x2="266" y2="120"/>
      <line x1="14" y1="140" x2="266" y2="140"/>
      <line x1="14" y1="160" x2="266" y2="160"/>
      <line x1="14" y1="180" x2="266" y2="180"/>
      <line x1="14" y1="200" x2="266" y2="200"/>
      <line x1="14" y1="220" x2="266" y2="220"/>
    </g>
  </g>
  <text x="200" y="370" text-anchor="middle" font-family="monospace" font-size="9"
    letter-spacing="4" fill="${GOLD}" opacity="0.7">SEALED · CHAIN OF CUSTODY</text>
</svg>`);
}

/** Crime scene placeholder — chalk-outline / room feel */
function sceneImg(seed: string, label: string) {
  const h = hash(seed);
  const rot = (h % 12) - 6;
  return encode(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g" cx="50%" cy="55%" r="70%">
      <stop offset="0%" stop-color="#1c1a15"/>
      <stop offset="70%" stop-color="#0d0b08"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    ${grain("g3")}
  </defs>
  <rect width="640" height="480" fill="url(#g)"/>
  <rect width="640" height="480" fill="url(#g)" filter="url(#g3)" opacity="0.55"/>
  <g transform="translate(320 260) rotate(${rot})" stroke="#e8dcc0" stroke-width="3"
     fill="none" opacity="0.55" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="0" cy="-90" rx="28" ry="34"/>
    <path d="M-30,-60 C-70,-30 -80,40 -60,90 L-30,140"/>
    <path d="M30,-60 C70,-30 80,40 60,90 L30,140"/>
    <path d="M-15,-25 L-40,80"/>
    <path d="M15,-25 L40,80"/>
  </g>
  <g stroke="${RED}" stroke-width="4" opacity="0.75">
    <line x1="0" y1="60" x2="640" y2="60"/>
    <line x1="0" y1="420" x2="640" y2="420"/>
  </g>
  <text x="20" y="46" font-family="monospace" font-size="14" letter-spacing="4" fill="${RED}">DO NOT CROSS · CRIME SCENE</text>
  <text x="20" y="450" font-family="monospace" font-size="14" letter-spacing="4" fill="${RED}">DO NOT CROSS · CRIME SCENE</text>
  <text x="320" y="450" text-anchor="middle" font-family="Georgia, serif" font-size="18"
    letter-spacing="6" fill="${GOLD}" opacity="0.85">${label.toUpperCase().slice(0,42)}</text>
</svg>`);
}

function documentImg(seed: string, label: string) {
  return encode(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice">
  <defs>${grain("g4")}</defs>
  <rect width="400" height="520" fill="#efe6cf"/>
  <rect width="400" height="520" fill="#efe6cf" filter="url(#g4)" opacity="0.4"/>
  <rect x="30" y="30" width="340" height="460" fill="none" stroke="#8a7a52"/>
  <text x="200" y="70" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="6" fill="#5c4d2d">DOSSIER X</text>
  <text x="200" y="98" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#1a1610">${label.slice(0,28)}</text>
  <g stroke="#5c4d2d" stroke-width="0.5" opacity="0.5">
    ${Array.from({length:14}).map((_,i)=>`<line x1="50" y1="${140+i*22}" x2="350" y2="${140+i*22}"/>`).join("")}
  </g>
  <g transform="translate(280 420) rotate(-8)">
    <rect x="0" y="0" width="90" height="40" fill="none" stroke="${RED}" stroke-width="2"/>
    <text x="45" y="26" text-anchor="middle" font-family="monospace" font-size="12"
      letter-spacing="2" fill="${RED}">CONFIDENTIAL</text>
  </g>
  <text x="${hash(seed)%40+40}" y="${hash(seed)%40+480}" font-family="monospace" font-size="10"
    fill="#5c4d2d" opacity="0.6">FILE · ${(hash(seed)%99999).toString().padStart(5,"0")}</text>
</svg>`);
}

function coverImg(seed: string, title: string) {
  return encode(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2a2317"/>
      <stop offset="80%" stop-color="#0b0906"/>
    </radialGradient>
    ${grain("g5")}
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect width="800" height="500" fill="url(#g)" filter="url(#g5)" opacity="0.6"/>
  <text x="400" y="240" text-anchor="middle" font-family="Georgia, serif"
    font-size="42" letter-spacing="8" fill="${GOLD}">${title.toUpperCase().slice(0,28)}</text>
  <text x="400" y="290" text-anchor="middle" font-family="monospace"
    font-size="14" letter-spacing="12" fill="${INK}" opacity="0.7">DOSSIER · X · CASEFILE</text>
  <g stroke="${GOLD_DEEP}" fill="none">
    <rect x="40" y="40" width="720" height="420"/>
    <rect x="52" y="52" width="696" height="396"/>
  </g>
  <text x="60" y="480" font-family="monospace" font-size="10" letter-spacing="4" fill="${GOLD}">SEED ${(hash(seed)%99999).toString().padStart(5,"0")}</text>
</svg>`);
}

export function placeholderFor(
  kind: PlaceholderKind,
  seed: string,
  label = "",
  sub = "",
): string {
  switch (kind) {
    case "portrait": return portrait(seed, label || seed, sub);
    case "witness":  return portrait(seed, label || seed, sub, "#d9c48a");
    case "evidence": return evidenceCard(seed, label || "Evidence", sub || "Physical");
    case "scene":    return sceneImg(seed, label || "Crime Scene");
    case "document": return documentImg(seed, label || "Report");
    case "cover":    return coverImg(seed, label || "Casefile");
  }
}
