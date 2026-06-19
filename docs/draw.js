"use strict";

// ── FIREBASE CONFIG ──────────────────────────────────────────────────────────
// 1. Go to console.firebase.google.com → your project → Project settings → Your apps
// 2. Copy the firebaseConfig object and paste it here.
const firebaseConfig = {
  apiKey: "AIzaSyCSNrRTAFnSO7jTJmDcq70PPWAaTEOOb_E",
  authDomain: "boonallan-world-cup.firebaseapp.com",
  databaseURL: "https://boonallan-world-cup-default-rtdb.firebaseio.com",
  projectId: "boonallan-world-cup",
  storageBucket: "boonallan-world-cup.firebasestorage.app",
  messagingSenderId: "818446383690",
  appId: "1:818446383690:web:a34eec93e3e3e8b05144b3",
  measurementId: "G-T6TTSMLBPL"
};
// ─────────────────────────────────────────────────────────────────────────────

// Flag CDN codes — kept in sync with app.js
const FLAG_CODES = {
  "argentina": "ar", "brazil": "br", "colombia": "co", "ecuador": "ec",
  "uruguay": "uy", "venezuela": "ve", "chile": "cl", "paraguay": "py",
  "peru": "pe", "bolivia": "bo",
  "france": "fr", "germany": "de", "spain": "es", "england": "gb-eng",
  "portugal": "pt", "netherlands": "nl", "belgium": "be", "italy": "it",
  "switzerland": "ch", "croatia": "hr", "serbia": "rs", "poland": "pl",
  "denmark": "dk", "austria": "at", "turkey": "tr", "slovakia": "sk",
  "scotland": "gb-sct", "wales": "gb-wls", "northern ireland": "gb-nir",
  "hungary": "hu", "romania": "ro", "ukraine": "ua", "greece": "gr",
  "czech republic": "cz", "czechia": "cz", "sweden": "se", "norway": "no",
  "finland": "fi", "ireland": "ie", "republic of ireland": "ie",
  "slovenia": "si", "albania": "al",
  "usa": "us", "united states": "us", "mexico": "mx", "canada": "ca",
  "costa rica": "cr", "panama": "pa", "honduras": "hn", "jamaica": "jm",
  "el salvador": "sv", "haiti": "ht", "trinidad and tobago": "tt",
  "cuba": "cu", "suriname": "sr",
  "morocco": "ma", "senegal": "sn", "nigeria": "ng", "egypt": "eg",
  "cameroon": "cm", "ivory coast": "ci", "côte d'ivoire": "ci",
  "cote d'ivoire": "ci", "algeria": "dz", "south africa": "za",
  "ghana": "gh", "mali": "ml", "guinea": "gn", "tunisia": "tn",
  "dr congo": "cd", "congo dr": "cd", "congo": "cg",
  "bosnia & herzegovina": "ba", "bosnia and herzegovina": "ba",
  "curaçao": "cw", "curacao": "cw", "türkiye": "tr",
  "zambia": "zm", "kenya": "ke", "ethiopia": "et", "tanzania": "tz",
  "cape verde": "cv", "cape verde islands": "cv",
  "japan": "jp", "south korea": "kr", "korea republic": "kr",
  "iran": "ir", "australia": "au", "saudi arabia": "sa",
  "uzbekistan": "uz", "jordan": "jo", "iraq": "iq", "qatar": "qa",
  "china": "cn", "china pr": "cn", "indonesia": "id", "new zealand": "nz",
};

function flagImg(teamName, size = 20) {
  const code = FLAG_CODES[teamName.toLowerCase()];
  if (!code) return "";
  const h = Math.round(size * 0.75);
  return `<img src="https://flagcdn.com/w${size}/${code}.png" width="${size}" height="${h}" alt="">`;
}

// ── State ────────────────────────────────────────────────────────────────────
// cardOrder[i] = team_id at card position i  (lives only in JS memory, never in DOM)
let cardOrder = [];
let teamById = {};       // team_id → {team_id, team}
let claims = {};         // {team_id: {name, claimed_at}} from Firebase
let playerName = "";
let cardsPerPerson = 2;
let db = null;

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  if (firebaseConfig.apiKey === "REPLACE_ME") {
    showFatalError(
      "Firebase is not configured yet. " +
      "Open draw.js and replace the firebaseConfig values with your project's config."
    );
    return;
  }

  // Load team list + config from data.json
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const allTeams = data.all_teams || [];
    allTeams.forEach(t => { teamById[t.team_id] = t; });
    cardOrder = allTeams.map(t => t.team_id).sort(() => Math.random() - 0.5);
    cardsPerPerson = data.cards_per_person || 2;
  } catch (e) {
    showFatalError("Could not load team data: " + e.message);
    return;
  }

  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();

  // Restore saved name
  const saved = localStorage.getItem("draw_player_name") || "";
  const nameInput = document.getElementById("player-name");
  if (saved) {
    nameInput.value = saved;
    playerName = saved;
  }
  nameInput.addEventListener("input", () => {
    playerName = nameInput.value.trim();
    localStorage.setItem("draw_player_name", playerName);
    updateCounter();
    refreshCardStates();
  });

  // Render card shells (all face-down, random order)
  renderCardGrid();

  // Subscribe to live Firebase claims
  db.ref("claims").on("value", snapshot => {
    claims = snapshot.val() || {};
    updateCounter();
    refreshCardStates();
    checkDrawComplete();
  });
}

// ── Card grid ─────────────────────────────────────────────────────────────────
function renderCardGrid() {
  const grid = document.getElementById("card-grid");
  // Cards carry only a position index — team identity stays in JS memory only
  grid.innerHTML = cardOrder.map((_, i) => `
    <div class="card-wrap" data-pos="${i}">
      <div class="card" id="card-pos-${i}">
        <div class="card-face card-cover">
          <span class="card-soccer">⚽</span>
        </div>
        <div class="card-face card-reveal" id="reveal-pos-${i}"></div>
      </div>
    </div>`).join("");

  grid.querySelectorAll(".card-wrap").forEach(wrap => {
    wrap.addEventListener("click", () => handleCardClick(wrap));
  });
}

// ── Update card visual states ─────────────────────────────────────────────────
function refreshCardStates() {
  const canPick = playerName.length > 0 && picksRemaining() > 0;

  cardOrder.forEach((teamId, i) => {
    const card = document.getElementById(`card-pos-${i}`);
    if (!card) return;
    const wrap = card.closest(".card-wrap");
    const claim = claims[teamId];

    if (claim) {
      // Inject team content now (first time only) — nothing was in the DOM before
      const revealEl = document.getElementById(`reveal-pos-${i}`);
      if (revealEl && !revealEl.dataset.filled) {
        const t = teamById[teamId];
        revealEl.innerHTML = `
          <div class="reveal-flag">${flagImg(t.team, 24)}</div>
          <div class="reveal-team">${t.team}</div>
          <div class="reveal-claimer">${claim.name}</div>`;
        revealEl.dataset.filled = "1";
      }
      card.classList.add("is-flipped");
      const isMe = claim.name === playerName;
      card.classList.toggle("claimed-mine", isMe);
      card.classList.toggle("claimed-other", !isMe);
      wrap.classList.remove("can-pick");
    } else {
      wrap.classList.toggle("can-pick", canPick);
    }
  });
}

// ── Counter ───────────────────────────────────────────────────────────────────
function picksRemaining() {
  if (!playerName) return 0;
  const mine = Object.values(claims).filter(c => c && c.name === playerName).length;
  return Math.max(0, cardsPerPerson - mine);
}

function updateCounter() {
  const el = document.getElementById("pick-counter");
  if (!el) return;
  if (!playerName) {
    el.textContent = "Enter your name above to start picking";
    el.className = "pick-counter";
    return;
  }
  const remaining = picksRemaining();
  if (remaining === 0) {
    const mine = Object.values(claims).filter(c => c && c.name === playerName).length;
    if (mine > 0) {
      el.textContent = `You've made all ${cardsPerPerson} of your picks — good luck!`;
      el.className = "pick-counter done";
    } else {
      el.textContent = `All ${cardsPerPerson} picks already used for "${playerName}"`;
      el.className = "pick-counter done";
    }
  } else {
    el.textContent = `${playerName} — ${remaining} pick${remaining !== 1 ? "s" : ""} remaining`;
    el.className = "pick-counter active";
  }
}

// ── Card click ────────────────────────────────────────────────────────────────
async function handleCardClick(wrap) {
  const teamId = cardOrder[parseInt(wrap.dataset.pos)];

  if (claims[teamId]) return; // already claimed

  if (!playerName) {
    const input = document.getElementById("player-name");
    input.focus();
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 400);
    showToast("Enter your name first!");
    return;
  }

  if (picksRemaining() <= 0) {
    showToast(`You've already used all ${cardsPerPerson} of your picks.`);
    return;
  }

  // Disable while transaction runs
  wrap.classList.add("pending");

  try {
    const result = await db.ref(`claims/${teamId}`).transaction(current => {
      if (current !== null) return undefined; // abort — already taken
      return { name: playerName, claimed_at: Date.now() };
    });

    if (!result.committed) {
      showToast("Someone else just grabbed that one — try another card!");
    }
    // Firebase onValue will handle the flip if committed
  } catch (err) {
    showToast("Something went wrong. Please try again.");
    console.error(err);
  } finally {
    wrap.classList.remove("pending");
  }
}

// ── Draw complete check ───────────────────────────────────────────────────────
function checkDrawComplete() {
  if (!cardOrder.length) return;
  const allClaimed = cardOrder.every(teamId => claims[teamId]);
  document.getElementById("draw-all-done").hidden = !allClaimed;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.hidden = true; }, 3000);
}

function showFatalError(msg) {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = `<p class="draw-error">${msg}</p>`;
  document.getElementById("draw-setup").hidden = true;
}

init().catch(err => showFatalError("Initialisation failed: " + err.message));
