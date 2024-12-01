// DOM utilities
function findElement(selector, context = document) {
  return context.querySelector(selector);
}

function createObserver(callback) {
  return new MutationObserver((mutations) => {
    const shouldUpdate = mutations.some(mutation => {
      return mutation.target.classList?.contains('page-title') ||
             findElement('.page-title', mutation.target);
    });
    
    if (shouldUpdate) {
      callback();
    }
  });
}

function getWineNameFromSAQ() {
  const titleElement = findElement('.page-title');
  return titleElement ? titleElement.textContent.trim() : '';
}