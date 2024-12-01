// DOM manipulation utilities
function createObserver(callback) {
  return new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        callback();
      }
    }
  });
}

function getWineNameFromSAQ() {
  const titleElement = document.querySelector('.page-title');
  return titleElement ? titleElement.textContent.trim() : '';
}

// Vivino API utilities
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

async function searchVivinoWine(wineName) {
  try {
    const vivinoSearchUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(wineName)}`;
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(vivinoSearchUrl)}`);
    
    if (!response.ok) throw new Error('Failed to fetch from Vivino');
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const firstResult = doc.querySelector('[data-vintage]');
    if (!firstResult) return null;
    
    const name = firstResult.querySelector('.wine-card__name')?.textContent.trim();
    const ratingElement = firstResult.querySelector('.average__number');
    const rating = ratingElement ? parseFloat(ratingElement.textContent) : 'N/A';
    const ratingsCountElement = firstResult.querySelector('.average__stars--count');
    const ratings_count = ratingsCountElement ? 
      parseInt(ratingsCountElement.textContent.replace(/[^0-9]/g, '')) : 0;

    return { name, rating, ratings_count };
  } catch (error) {
    console.error('Error fetching from Vivino:', error);
    return null;
  }
}