const API_BASE = "http://localhost:3000";

// ── Context Menu Setup ──

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-image",
    title: "Save image to Beauty",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "save-link",
    title: "Save link to Beauty",
    contexts: ["link"],
  });

  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save text to Beauty",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "save-page",
    title: "Save page to Beauty",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    id: "save-video",
    title: "Save video to Beauty",
    contexts: ["video"],
  });

  chrome.contextMenus.create({
    id: "save-audio",
    title: "Save audio to Beauty",
    contexts: ["audio"],
  });
});

// ── Context Menu Handler ──

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let payload = null;

  switch (info.menuItemId) {
    case "save-image":
      payload = {
        type: "image",
        url: info.srcUrl,
        sourceUrl: info.pageUrl,
        sourceTitle: tab?.title || "",
      };
      break;

    case "save-video":
      payload = {
        type: "video",
        url: info.srcUrl,
        sourceUrl: info.pageUrl,
        sourceTitle: tab?.title || "",
      };
      break;

    case "save-audio":
      payload = {
        type: "music",
        url: info.srcUrl,
        sourceUrl: info.pageUrl,
        sourceTitle: tab?.title || "",
      };
      break;

    case "save-link":
      payload = {
        type: "image",
        url: info.linkUrl,
        sourceUrl: info.pageUrl,
        sourceTitle: tab?.title || "",
      };
      break;

    case "save-selection":
      payload = {
        type: "text",
        content: info.selectionText,
        sourceUrl: info.pageUrl,
        sourceTitle: tab?.title || "",
      };
      break;

    case "save-page":
      payload = {
        type: "image",
        url: tab?.url,
        sourceUrl: tab?.url,
        sourceTitle: tab?.title || "",
      };
      break;
  }

  if (payload) {
    await saveToBeauty(payload);
    // Show notification in content script
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: "show-save-toast",
        data: payload,
      });
    }
  }
});

// ── Save to Beauty API ──

async function saveToBeauty(payload) {
  const { token } = await chrome.storage.local.get("token");

  try {
    const res = await fetch(`${API_BASE}/api/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Save failed:", res.status);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Save error:", err);
    return false;
  }
}

// ── Message Handler ──

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "save") {
    saveToBeauty(msg.data).then((ok) => sendResponse({ success: ok }));
    return true; // async
  }

  if (msg.action === "get-auth") {
    chrome.storage.local.get(["token", "user"], (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (msg.action === "set-auth") {
    chrome.storage.local.set({ token: msg.token, user: msg.user }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (msg.action === "logout") {
    chrome.storage.local.remove(["token", "user"], () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
