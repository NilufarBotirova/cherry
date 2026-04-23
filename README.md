# Cherry

Local-first travel booking demo built with plain HTML, CSS, and JavaScript.

## Run locally

Option 1:
Open `/Users/android_oson/Desktop/local project/index.html` directly in your browser.
Open `/Users/android_oson/Desktop/local project/places.html` for the stays page.
Open `/Users/android_oson/Desktop/local project/cart.html` for the cart page.

Option 2:
Run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## What is included

- Home landing page plus a separate stays listing page
- Real place photos stored locally in `images/`
- Multi-item cart with totals and removal actions
- Saved cart contents via `localStorage`

## Files

- `index.html` for the home page
- `places.html` for the stays listing page
- `cart.html` for the separate cart page
- `detail.html` for the stay details page
- `about.html` for the about us page
- `contact.html` for the contact us page
- `styles.css` for layout and visual design
- `stays-data.js` for shared stay data
- `script.js` for the stays page interactions
- `cart.js` for the cart page interactions
- `detail.js` for the details page interactions
- `PHOTO_CREDITS.md` for image sources
