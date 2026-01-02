const API = process.env.REACT_APP_API_URL || "http://localhost:9001/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

async function login(email, password) {
  const r = await fetch(`${API}/teachers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!r.ok) throw new Error("Invalid credentials");

  const data = await r.json();
  setToken(data.token);
  return data;
}

async function getMe() {
  const r = await fetch(`${API}/teachers/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!r.ok) throw new Error("Unauthorized");
  return await r.json();
}

async function registerTeacher({ name, email, password }) {
  const r = await fetch(`${API}/teachers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  if (!r.ok) throw new Error("Eroare la înregistrare profesor");
  return await r.json();
}

export default { login, getMe, registerTeacher };
