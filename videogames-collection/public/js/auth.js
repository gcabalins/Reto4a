async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  showMessage(data);

  if (res.ok) {
    window.location.href = "home.html";
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  showMessage(data);

  if (res.ok) {
    window.location.href = "home.html";
  }
}

function showMessage(data) {
  const msg = document.getElementById("msg");
  msg.classList.remove("d-none", "alert-danger", "alert-success");
  msg.classList.add(data.error ? "alert-danger" : "alert-success");
  msg.textContent = data.error || data.message;
}
