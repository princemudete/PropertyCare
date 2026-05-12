// export * from './services/api.js'
await fetch("http://127.0.0.1:8000/api/login/", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  },
  body: JSON.stringify({
    username,
    password,
  }),
});
