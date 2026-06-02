const { createClient } = supabase;

const SUPABASE_URL = "https://ygvessfdplpcdbuyvygh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndmVzc2ZkcGxwY2RidXl2eWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzUwNzAsImV4cCI6MjA5NjAxMTA3MH0.KKqNQWDSQRKDKACQ8HmAD1aQ-iQQA0Ez6vXq1hLjYiE";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const navBtns = document.querySelectorAll(".nav-btn");
const sideItems = document.querySelectorAll(".side-item");
const pages = document.querySelectorAll(".page");

const userPill = document.getElementById("user-pill");
const subtitle = document.getElementById("subtitle");
const logoutBtn = document.getElementById("logout-btn");
const settingsLogoutBtn = document.getElementById("settings-logout-btn");
const settingsEmail = document.getElementById("settings-email");
const settingsStatus = document.getElementById("settings-status");

const storeList = document.getElementById("store-list");
const libraryList = document.getElementById("library-list");

const gotwTitle = document.getElementById("gotw-title");
const gotwDesc = document.getElementById("gotw-desc");
const gotwTag = document.getElementById("gotw-tag");
const gotwRating = document.getElementById("gotw-rating");

const themeSelect = document.getElementById("theme-select");

let localLibrary = [];
let games = [];

// Navigation
function setPage(pageId) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + pageId).classList.add("active");

  navBtns.forEach(b => b.classList.toggle("active", b.dataset.page === pageId));
  sideItems.forEach(b => b.classList.toggle("active", b.dataset.page === pageId));
}

navBtns.forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));
sideItems.forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));

// Load games.json
fetch("data/games.json")
  .then(r => r.json())
  .then(data => {
    games = data;
    pickGOTW();
    renderStore();
    renderLibrary();
  });

// GOTW
function pickGOTW() {
  if (!games.length) return;
  const featured = games.filter(g => g.featured);
  const pool = featured.length ? featured : games;
  const game = pool[Math.floor(Math.random() * pool.length)];

  gotwTitle.textContent = game.title;
  gotwDesc.textContent = game.desc;
  gotwTag.textContent = `${game.tag} • Game of the Week`;
  gotwRating.innerHTML = `${game.rating.toFixed(1)}★ average<br>Based on ${game.reviews} reviews`;
}

// Store
function renderStore() {
  storeList.innerHTML = "";
  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <div class="game-title">${game.title}</div>
      <div class="game-meta">${game.tag} • ${game.desc}</div>
      <div class="game-footer">
        <span class="price-tag">${game.price}</span>
        <button class="btn-small" data-id="${game.id}">Add to Library</button>
      </div>
    `;
    storeList.appendChild(card);
  });

  storeList.addEventListener("click", e => {
    if (e.target.matches("button[data-id]")) {
      const id = e.target.getAttribute("data-id");
      const game = games.find(g => g.id === id);
      if (!game) return;
      if (!localLibrary.find(g => g.id === id)) {
        localLibrary.push(game);
        renderLibrary();
      }
    }
  }, { once: true });
}

// Library
function renderLibrary() {
  libraryList.innerHTML = "";
  if (!localLibrary.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `Your library is empty.<br>Add something from the Store.`;
    libraryList.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "library-list";

  localLibrary.forEach(game => {
    const item = document.createElement("div");
    item.className = "library-item";
    item.innerHTML = `
      <div>
        <div class="library-title">${game.title}</div>
        <div class="library-meta">${game.tag} • ${game.price}</div>
      </div>
      <button class="btn-outline" data-id="${game.id}">Launch (mock)</button>
    `;
    list.appendChild(item);
  });

  libraryList.appendChild(list);

  list.addEventListener("click", e => {
    if (e.target.matches("button[data-id]")) {
      const id = e.target.getAttribute("data-id");
      const game = localLibrary.find(g => g.id === id);
      if (!game) return;
      alert("In real NovaTop, this would launch: " + game.title);
    }
  }, { once: true });
}

// Theme
themeSelect.addEventListener("change", () => {
  if (themeSelect.value === "softer") {
    document.body.style.background = "linear-gradient(#05070d, #020308)";
  } else {
    document.body.style.background = "linear-gradient(#010204, #000000)";
  }
});

// Auth/session
async function checkSession() {
  const demo = localStorage.getItem("novatop_demo") === "1";
  if (demo) {
    localStorage.removeItem("novatop_demo");
    userPill.textContent = "demo@novatop.local";
    settingsEmail.textContent = "Email: demo@novatop.local";
    settingsStatus.textContent = "Status: Demo mode";
    subtitle.textContent = "Demo session";
    return;
  }

  const { data } = await client.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
    return;
  }

  const user = data.session.user;
  userPill.textContent = user.email;
  settingsEmail.textContent = "Email: " + user.email;
  settingsStatus.textContent = "Status: Signed in";
  subtitle.textContent = "Welcome, " + (user.email.split("@")[0] || "Player");
}

async function doLogout() {
  try {
    await client.auth.signOut();
  } catch (e) {}
  window.location.href = "login.html";
}

logoutBtn.addEventListener("click", doLogout);
settingsLogoutBtn.addEventListener("click", doLogout);

checkSession();
