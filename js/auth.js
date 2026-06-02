const { createClient } = supabase;

const SUPABASE_URL = "https://ygvessfdplpcdbuyvygh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndmVzc2ZkcGxwY2RidXl2eWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzUwNzAsImV4cCI6MjA5NjAxMTA3MH0.KKqNQWDSQRKDKACQ8HmAD1aQ-iQQA0Ez6vXq1hLjYiE";

const authClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const demoBtn = document.getElementById("demo-btn");
const errorEl = document.getElementById("auth-error");

loginBtn.addEventListener("click", async () => {
  errorEl.textContent = "";
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorEl.textContent = "Enter email and password.";
    return;
  }

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    const { data: signUpData, error: signUpError } =
      await authClient.auth.signUp({ email, password });

    if (signUpError) {
      errorEl.textContent = signUpError.message;
      return;
    }
  }

  window.location.href = "app.html";
});

demoBtn.addEventListener("click", () => {
  localStorage.setItem("novatop_demo", "1");
  window.location.href = "app.html";
});
