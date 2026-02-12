const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

if (gameId) {
  document.getElementById("titleForm").textContent = "Editar videojuego";
  loadGame(gameId);
}

async function loadGame(id) {
  const res = await fetch("/api/games");
  const games = await res.json();
  const game = games.find(g => g.id == id);

  if (!game) return;

  document.getElementById("title").value = game.title;
  document.getElementById("platform").value = game.platform;
  document.getElementById("genre").value = game.genre;
  document.getElementById("status").value = game.status;
}

async function saveGame(e) {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    platform: document.getElementById("platform").value,
    genre: document.getElementById("genre").value,
    status: document.getElementById("status").value
  };

  const method = gameId ? "PUT" : "POST";
  const url = gameId ? `/api/games/${gameId}` : `/api/games`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const msg = document.getElementById("msg");
  msg.classList.remove("d-none");

  if (res.ok) {
    msg.classList.add("alert-success");
    msg.textContent = "Guardado correctamente";

    setTimeout(() => {
      window.location.href = "home.html";
    }, 800);
  } else {
    msg.classList.add("alert-danger");
    msg.textContent = "Error al guardar";
  }
}
