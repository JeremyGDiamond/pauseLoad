// Default values
let blockedSites = ["youtube.com"];
let delay = 5000;
let customMessage = "You really need to be productive right now!";

// Function to load settings from storage
async function loadSettings() {
  const settings = await browser.storage.local.get(["blockedSites", "delay", "customMessage"]);
  blockedSites = settings.blockedSites || ["youtube.com"];
  delay = settings.delay || 5000;
  customMessage = settings.customMessage || "You really need to be productive right now!";
  console.log("Updated settings:", { blockedSites, delay, customMessage });
}

// Load settings initially
loadSettings();

// Listen for storage changes (when user updates settings in popup)
browser.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local") {
    console.log("Settings updated:", changes);
    await loadSettings(); // Reload new settings
  }
});

// Function to show the blocking overlay
function showOverlay(delay, message) {
  let existing = document.getElementById('productivity-overlay');
  if (existing) return;

  let div = document.createElement('div');
  div.id = 'productivity-overlay';
  div.innerText = message;
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.background = 'black';
  div.style.color = 'white';
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.style.fontSize = '32px';
  div.style.zIndex = '999999';
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, delay);
}

// Function to delay navigation
async function delayNavigation(details) {
  const url = new URL(details.url);

  if (blockedSites.includes(url.hostname)) {
    console.log(`Delaying navigation to: ${details.url}`);

    // Show the overlay with the custom message
    await browser.scripting.executeScript({
      target: { tabId: details.tabId },
      func: showOverlay,
      args: [delay, customMessage]
    });

    // Wait before letting the user continue
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log(`Releasing navigation: ${details.url}`);
  }
}

// Listen for standard page loads
browser.webNavigation.onCommitted.addListener(delayNavigation, {
  url: [{ schemes: ["http", "https"] }]
});

// Listen for SPA navigations
browser.webNavigation.onHistoryStateUpdated.addListener(delayNavigation, {
  url: [{ schemes: ["http", "https"] }]
});
