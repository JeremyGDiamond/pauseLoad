document.addEventListener("DOMContentLoaded", async () => {
    const blockedSitesInput = document.getElementById("blockedSites");
    const delayInput = document.getElementById("delay");
    const customMessageInput = document.getElementById("customMessage");
  
    // Load settings into popup fields
    const settings = await browser.storage.local.get(["blockedSites", "delay", "customMessage"]);
    blockedSitesInput.value = (settings.blockedSites || ["youtube.com"]).join(", ");
    delayInput.value = settings.delay || 5000;
    customMessageInput.value = settings.customMessage || "You really need to be productive right now!";
  
    // Save settings when "Save" button is clicked
    document.getElementById("save").addEventListener("click", async () => {
      const newBlockedSites = blockedSitesInput.value.split(",").map(site => site.trim());
      const newDelay = parseInt(delayInput.value, 10);
      const newCustomMessage = customMessageInput.value.trim() || "You really need to be productive right now!";
  
      await browser.storage.local.set({
        blockedSites: newBlockedSites,
        delay: newDelay,
        customMessage: newCustomMessage
      });

      alert("Settings saved!"); 
  
      console.log("Settings saved!", { blockedSites: newBlockedSites, delay: newDelay, customMessage: newCustomMessage });
    });
  });
  