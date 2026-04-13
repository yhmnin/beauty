// ── Save to Beauty: Content Script ──
// Adds hover overlay on images (like Cosmos extension)

(() => {
  let overlay = null;
  let currentTarget = null;

  const SITES = {
    instagram: { match: /instagram\.com/, selector: "article img" },
    pinterest: { match: /pinterest\./, selector: "[data-test-id='pin'] img, img[srcset]" },
    default: { match: /.*/, selector: null },
  };

  function createOverlay() {
    const el = document.createElement("div");
    el.id = "beauty-save-overlay";
    el.innerHTML = `
      <button id="beauty-save-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2.5V14L8 10.5L13 14V2.5C13 2.22386 12.7761 2 12.5 2H3.5C3.22386 2 3 2.22386 3 2.5Z"/>
        </svg>
        <span>Save</span>
      </button>
    `;
    document.body.appendChild(el);
    return el;
  }

  function showOverlay(img) {
    if (!overlay) overlay = createOverlay();

    const rect = img.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY + 8}px`;
    overlay.style.left = `${rect.right + window.scrollX - 80}px`;
    overlay.style.display = "block";
    currentTarget = img;

    const btn = overlay.querySelector("#beauty-save-btn");
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const src = img.src || img.currentSrc || img.getAttribute("srcset")?.split(" ")[0] || "";

      chrome.runtime.sendMessage(
        {
          action: "save",
          data: {
            type: "image",
            url: src,
            sourceUrl: window.location.href,
            sourceTitle: document.title,
          },
        },
        (response) => {
          if (response?.success) {
            showToast("Saved to Beauty");
            btn.querySelector("span").textContent = "Saved!";
            setTimeout(() => {
              btn.querySelector("span").textContent = "Save";
            }, 2000);
          }
        }
      );
    };
  }

  function hideOverlay() {
    if (overlay) overlay.style.display = "none";
    currentTarget = null;
  }

  // ── Image hover detection ──

  document.addEventListener("mouseover", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    const rect = img.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 80) return; // Skip tiny images

    showOverlay(img);
  });

  document.addEventListener("mouseout", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    setTimeout(() => {
      if (overlay && !overlay.matches(":hover") && currentTarget === img) {
        hideOverlay();
      }
    }, 200);
  });

  // ── Toast notification ──

  function showToast(message) {
    const existing = document.getElementById("beauty-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "beauty-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("beauty-toast-visible");
    });

    setTimeout(() => {
      toast.classList.remove("beauty-toast-visible");
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // ── Listen for background messages ──

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "show-save-toast") {
      showToast(`Saved ${msg.data.type} to Beauty`);
    }
  });

  // ── Text selection save ──

  document.addEventListener("mouseup", (e) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 10) return;

    // Text selection is handled via context menu, not overlay
  });
})();
