
const DEFAULT_PLATFORMS = [
  "PC", "PlayStation 5", "PlayStation 4",
  "Xbox Series X", "Xbox One", "Nintendo Switch"
];

const DEFAULT_GENRES = [
  "Acción", "Aventura", "RPG", "Shooter",
  "Deportes", "Carreras", "Estrategia", "Indie"
];
let showingAll = false; 
function toggleView() { 
  showingAll = !showingAll; 
  loadGames(showingAll); 
}

async function loadGames(showAll = false) {
  const platform = document.getElementById("f_platform").value;
  const genre = document.getElementById("f_genre").value;
  const status = document.getElementById("f_status").value;

  const params = new URLSearchParams();
  if (platform) params.append("platform", platform);
  if (genre) params.append("genre", genre);
  if (status) params.append("status", status);

  const res = await fetch("/api/games?" + params.toString());
  let games = await res.json();

  const tbody = document.getElementById("gamesTable");
  tbody.innerHTML = "";
  if (!showAll) { 
    const favs = getFavorites(); 
    games = games.filter(g => favs.includes(g.id)); 
  }
  games.forEach(g => {
    tbody.innerHTML += `
      <tr>
        <td>${g.title}</td>
        <td>${g.platform}</td>
        <td>${g.genre}</td>
        <td>${g.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-warning" onclick="toggleFavorite(${g.id})">
            ${isFavorite(g.id) ? "⭐" : "☆"}
          </button>
          <a href="form.html?id=${g.id}" class="btn btn-sm btn-warning">Editar</a>
          <button class="btn btn-sm btn-danger" onclick="deleteGame(${g.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

async function deleteGame(id) {
  if (!confirm("¿Eliminar este videojuego?")) return;

  const res = await fetch("/api/games/" + id, { method: "DELETE" });
  if (res.ok) loadGames();
}

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "index.html";
}
async function loadOptions() {
  const res = await fetch("/api/meta/options");
  const data = await res.json();

  const platforms = [...new Set([...DEFAULT_PLATFORMS, ...data.platforms])];
  const genres = [...new Set([...DEFAULT_GENRES, ...data.genres])];

  const platformSelects = document.querySelectorAll("#platform, #f_platform");
  const genreSelects = document.querySelectorAll("#genre, #f_genre");

  platformSelects.forEach(sel => {
    platforms.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      sel.appendChild(opt);
    });
  });

  genreSelects.forEach(sel => {
    genres.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = g;
      sel.appendChild(opt);
    });
  });
}
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  loadGames(); // refresca la tabla
}


loadOptions();
loadGames();
