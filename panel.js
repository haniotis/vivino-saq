class WineInfoPanel {
  constructor() {
    this.panel = this.createPanel();
    this.addToPage();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'wine-info-panel';
    return panel;
  }

  addToPage() {
    document.body.appendChild(this.panel);
  }

  updateContent(wineInfo) {
    const { name, rating, ratings_count } = wineInfo;
    this.panel.innerHTML = `
      <div class="wine-info-title">Vivino Wine Information</div>
      <div class="wine-info-content">
        <div class="wine-name">${name || 'Wine not found'}</div>
        ${rating !== 'N/A' ? `
          <div class="wine-rating">
            <span class="rating-value">★ ${rating.toFixed(1)}</span>
            <span class="ratings-count">(${ratings_count} ratings)</span>
          </div>
        ` : '<div class="wine-rating">No ratings available</div>'}
      </div>
    `;
  }

  showLoading() {
    this.panel.innerHTML = `
      <div class="wine-info-title">Vivino Wine Information</div>
      <div class="wine-info-content">
        <div class="loading">Searching wine...</div>
      </div>
    `;
  }

  showError(message) {
    this.panel.innerHTML = `
      <div class="wine-info-title">Vivino Wine Information</div>
      <div class="wine-info-content">
        <div class="error">${message}</div>
      </div>
    `;
  }
}