# SAQ Wine Info Chrome Extension

A Chrome extension that displays Vivino wine information for products on SAQ website.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this extension directory

## Features

- Fetches wine information from Vivino search results
- Displays wine name, rating, and number of ratings
- Updates automatically when navigating between products
- Clean and modern UI with loading and error states
- Uses CORS proxy to handle API requests

## Files

- `manifest.json`: Extension configuration
- `content.js`: Main extension logic
- `utils/dom.js`: DOM manipulation utilities
- `utils/api.js`: Vivino data fetching
- `components/panel.js`: UI panel component
- `styles.css`: Visual styling

## Note

This extension scrapes publicly available information from Vivino's search results. Make sure to comply with both SAQ's and Vivino's terms of service.