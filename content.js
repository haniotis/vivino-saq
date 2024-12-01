// Main extension logic
async function updateWineInfo(panel) {
  const wineName = getWineNameFromSAQ();
  if (!wineName) {
    panel.showError('Wine name not found on page');
    return;
  }

  panel.showLoading();

  try {
    const wineInfo = await searchVivinoWine(wineName);
    if (!wineInfo) {
      panel.showError('Wine not found on Vivino');
      return;
    }

    panel.updateContent(wineInfo);
  } catch (error) {
    console.error('Error:', error);
    panel.showError('Failed to fetch wine information');
  }
}

function init() {
  const panel = new WineInfoPanel();
  
  // Initial update
  updateWineInfo(panel);

  // Watch for DOM changes
  const observer = createObserver(() => updateWineInfo(panel));
  const mainContent = findElement('main') || document.body;
  observer.observe(mainContent, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Start the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}