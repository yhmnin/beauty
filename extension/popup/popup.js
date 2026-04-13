const API_BASE = "http://localhost:3000";

let isSignup = false;

document.addEventListener("DOMContentLoaded", async () => {
  const authView = document.getElementById("auth-view");
  const mainView = document.getElementById("main-view");

  // Check stored auth
  chrome.runtime.sendMessage({ action: "get-auth" }, (data) => {
    if (data?.user) {
      showMainView(data.user);
    }
  });

  // Login / Signup
  document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errEl = document.getElementById("auth-error");
    errEl.textContent = "";

    if (!email || !password) {
      errEl.textContent = "Email and password required";
      return;
    }

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup
        ? { name: email.split("@")[0], email, password }
        : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.user) {
        chrome.runtime.sendMessage(
          { action: "set-auth", token: data.token || email, user: data.user },
          () => showMainView(data.user)
        );
      } else {
        errEl.textContent = data.error || "Authentication failed";
      }
    } catch {
      errEl.textContent = "Cannot connect to Beauty. Is it running?";
    }
  });

  // Toggle signup/login
  document.getElementById("switch-mode").addEventListener("click", () => {
    isSignup = !isSignup;
    document.getElementById("login-btn").textContent = isSignup ? "Create Account" : "Sign In";
    document.getElementById("switch-mode").textContent = isSignup
      ? "Already have an account? Sign in"
      : "Don't have an account? Sign up";
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "logout" }, () => {
      mainView.style.display = "none";
      authView.style.display = "flex";
    });
  });

  // Save current page
  document.getElementById("save-page-btn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const btn = document.getElementById("save-page-btn");
    btn.textContent = "Saving...";

    chrome.runtime.sendMessage(
      {
        action: "save",
        data: {
          type: "image",
          url: tab.url,
          sourceUrl: tab.url,
          sourceTitle: tab.title || "",
        },
      },
      (response) => {
        btn.innerHTML = response?.success
          ? "✓ Saved!"
          : "Failed";
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2.5V14L8 10.5L13 14V2.5C13 2.22 12.78 2 12.5 2H3.5C3.22 2 3 2.22 3 2.5Z" stroke-linecap="round" stroke-linejoin="round"/></svg> Save Page`;
        }, 2000);
      }
    );
  });

  function showMainView(user) {
    authView.style.display = "none";
    mainView.style.display = "flex";
    document.getElementById("user-name").textContent = user.name || user.email;
  }
});
