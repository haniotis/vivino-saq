// CORS proxy configuration
const CORS_PROXY = 'https://corsproxy.io/?';

// Cache for wine search results
const wineCache = new Map();

async function fetchWithProxy(url) {
  const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Failed to fetch from proxy');
  return await response.text();
}

function parseRatingValue(text) {
  // First try to find a decimal number pattern
  const decimalMatch = text.match(/(\d+\.\d+)/);
  if (decimalMatch) {
    return Number(decimalMatch[1]);
  }
  
  // If no decimal found, try to find a whole number
  const wholeMatch = text.match(/(\d+)/);
  if (wholeMatch) {
    return Number(wholeMatch[1]); // Don't divide by 10, keep the original number
  }
  
  return 'N/A';
}

function extractRating(element) {
  // First try the detailed view rating within topSection
  const topSection = element.querySelector('.topSection');
  if (topSection) {
    const detailedRating = topSection.querySelector('.vivinoRating_averageValue__uDdPM');
    if (detailedRating) {
      const rating = parseRatingValue(detailedRating.textContent);
      if (rating !== 'N/A') return Number(rating.toFixed(1));
    }
  }
  
  // Then try the general detailed view rating
  const detailedRating = element.querySelector('.vivinoRating_averageValue__uDdPM, .detail-wine__ratings-average');
  if (detailedRating) {
    const rating = parseRatingValue(detailedRating.textContent);
    if (rating !== 'N/A') return Number(rating.toFixed(1));
  }
  
  // Then try search results rating
  const searchRating = element.querySelector('.average__number, .wine-card__rating');
  if (searchRating) {
    const rating = parseRatingValue(searchRating.textContent);
    if (rating !== 'N/A') return Number(rating.toFixed(1));
  }
  
  // Try data attributes as fallback
  const ratingContainer = element.querySelector('[data-rating]');
  if (ratingContainer) {
    const rating = parseRatingValue(ratingContainer.getAttribute('data-rating'));
    if (rating !== 'N/A') return Number(rating.toFixed(1));
  }
  
  return 'N/A';
}

function parseRatingsCount(text) {
  // First try to find a decimal number with 'k' suffix
  const kMatch = text.match(/(\d+\.?\d*)\s*k/i);
  if (kMatch) {
    return Number((parseFloat(kMatch[1]) * 1000).toFixed(1));
  }
  
  // Then try to find a regular number
  const numMatch = text.match(/(\d+\.?\d*)\s*ratings?/i);
  if (numMatch) {
    return Number(parseFloat(numMatch[1]).toFixed(1));
  }
  
  return 0;
}

function extractRatingsCount(element) {
  // First try the detailed view count within topSection
  const topSection = element.querySelector('.topSection');
  if (topSection) {
    const detailedCount = topSection.querySelector('.vivinoRating_caption__xL84P');
    if (detailedCount) {
      const count = parseRatingsCount(detailedCount.textContent);
      if (count > 0) return count;
    }
  }
  
  // Then try the general detailed view count
  const detailedCount = element.querySelector('.vivinoRating_caption__xL84P, .detail-wine__ratings-count');
  if (detailedCount) {
    const count = parseRatingsCount(detailedCount.textContent);
    if (count > 0) return count;
  }
  
  // Then try search results count
  const searchCount = element.querySelector('.average__stars--count, .wine-card__ratings-count');
  if (searchCount) {
    const count = parseRatingsCount(searchCount.textContent);
    if (count > 0) return count;
  }
  
  // Try data attributes as fallback
  const countContainer = element.querySelector('[data-ratings-count]');
  if (countContainer) {
    const count = parseRatingsCount(countContainer.getAttribute('data-ratings-count'));
    if (count > 0) return count;
  }
  
  return 0;
}

function normalizeWineName(name) {
  return name
    .toLowerCase()
    // Remove vintage year if present
    .replace(/\s+20\d{2}\s*$/, '')
    // Remove special characters
    .replace(/[^\w\s]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchVivinoWine(wineName) {
  // Check cache first
  if (wineCache.has(wineName)) {
    return wineCache.get(wineName);
  }

  try {
    // Extract vintage year if present
    const yearMatch = wineName.match(/\s+(20\d{2})\s*$/);
    const vintage = yearMatch ? yearMatch[1] : null;
    const searchName = normalizeWineName(wineName);

    const vivinoSearchUrl = `https://www.vivino.com/search/wines?q=${encodeURIComponent(searchName)}`;
    const html = await fetchWithProxy(vivinoSearchUrl);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to find the exact match first
    let results = Array.from(doc.querySelectorAll('[data-vintage]'));
    if (vintage) {
      results = results.filter(el => {
        const cardText = el.textContent.toLowerCase();
        return cardText.includes(vintage);
      });
    }
    
    const firstResult = results[0] || doc.querySelector('[data-vintage]');
    if (!firstResult) return null;
    
    const name = firstResult.querySelector('.wine-card__name')?.textContent.trim();
    const rating = extractRating(firstResult);
    const ratings_count = extractRatingsCount(firstResult);

    const result = { 
      name, 
      rating,
      ratings_count 
    };
    
    // Only cache if we found actual ratings
    if (rating !== 'N/A' && ratings_count > 0) {
      wineCache.set(wineName, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching from Vivino:', error);
    return null;
  }
}