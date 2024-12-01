class WineInfoPanel {
  constructor() {
    this.panel = this.createPanel();
    this.addToPage();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'wine-info-panel';
    panel.style.transform = 'translateZ(0)';
    return panel;
  }

  addToPage() {
    document.body.appendChild(this.panel);
  }

  updateContent(wineInfo) {
    this.panel.textContent = '';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'wine-info-title';
    titleDiv.textContent = 'Vivino Wine Information';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'wine-info-content';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'wine-name';
    nameDiv.textContent = wineInfo.name || 'Wine not found';
    
    contentDiv.appendChild(nameDiv);
    
    if (wineInfo.rating !== 'N/A') {
      const ratingDiv = document.createElement('div');
      ratingDiv.className = 'wine-rating';
      
      const ratingValue = document.createElement('span');
      ratingValue.className = 'rating-value';
      ratingValue.textContent = `★ ${wineInfo.rating}`;
      
      const ratingsCount = document.createElement('span');
      ratingsCount.className = 'ratings-count';
      ratingsCount.textContent = `(${wineInfo.ratings_count.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})} ratings)`;
      
      ratingDiv.appendChild(ratingValue);
      ratingDiv.appendChild(ratingsCount);
      contentDiv.appendChild(ratingDiv);
    } else {
      const noRating = document.createElement('div');
      noRating.className = 'wine-rating';
      noRating.textContent = 'No ratings available';
      contentDiv.appendChild(noRating);
    }
    
    this.panel.appendChild(titleDiv);
    this.panel.appendChild(contentDiv);
  }

  showLoading() {
    this.panel.textContent = '';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'wine-info-title';
    titleDiv.textContent = 'Vivino Wine Information';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'wine-info-content';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Searching wine...';
    
    contentDiv.appendChild(loadingDiv);
    this.panel.appendChild(titleDiv);
    this.panel.appendChild(contentDiv);
  }

  showError(message) {
    this.panel.textContent = '';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'wine-info-title';
    titleDiv.textContent = 'Vivino Wine Information';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'wine-info-content';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    contentDiv.appendChild(errorDiv);
    this.panel.appendChild(titleDiv);
    this.panel.appendChild(contentDiv);
  }
}