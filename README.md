# Uttar Pradesh Zoo Buddy

Build a mobile-first web app called "Smart Zoo Navigator" for zoos in Uttar Pradesh, India.

TECH & DESIGN

- Mobile-first responsive design (most users will be on phones inside the zoo)

- Clean, modern UI with a green/earthy nature-inspired color palette

- Fast, card-based layouts with rounded corners and smooth transitions

- Use placeholder images from Unsplash for animals and zoo scenery

PAGES & FEATURES TO BUILD

1. HOME PAGE

   - Hero section with a large zoo image/banner and app name

   - "Choose Your Zoo" dropdown/selector (start with 3-4 sample zoos in Uttar Pradesh, e.g. Lucknow Zoo, Kanpur Zoo, Etawah Safari Park)

   - Prominent search bar

   - Quick navigation buttons (Map, Animals, Tickets, Timings)

   - "Popular Zoos in Uttar Pradesh" horizontal scroll section with cards

2. INTERACTIVE ZOO MAP (core feature)

   - A visual map view of the selected zoo (use an SVG or image-based map with clickable markers/pins as a placeholder for a real GPS map)

   - Markers for: animal enclosures, entry/exit gates, restrooms, food courts, drinking water points, first aid stations, parking, wheelchair-accessible routes

   - Zoom in/out controls

   - Tapping a marker opens a small info card (name + short description + "Navigate" button)

   - A "You are here" marker (static/mock location for now)

3. SMART NAVIGATION

   - From the map, user can tap "Navigate" on any point of interest

   - Show a mock step-by-step directions panel: distance, estimated walking time, and simple turn-by-turn text instructions

   - Example format:

     "You are here → Walk 120m → Turn Left → Continue 80m → Tiger Enclosure"

4. ANIMAL EXPLORER

   - Grid/list page showing all animals in the selected zoo with photo + name

   - Tapping an animal opens a detail page with:

     - Image

     - Name & Scientific name

     - Habitat

     - Diet

     - Fun facts (2-3 bullet points)

     - Conservation status (badge: Least Concern / Vulnerable / Endangered / Critically Endangered)

     - Feeding time

     - "View on Map" button linking back to the map with that animal highlighted

   - "Nearby Animals" section at the bottom of each animal page showing 2-3 nearby animals with approximate distance (e.g. "Lion - 40m")

5. SMART SEARCH

   - Global search that searches across animals, facilities (washroom, food court, exit), and enclosures

   - Show results as a list with icons distinguishing animal vs facility results

   - Tapping a result navigates to that item's detail page or highlights it on the map

Populate everything with realistic sample/mock data for 10-12 animals (tiger, lion, elephant, giraffe, leopard, bear, crocodile, peacock, deer, monkey, etc.) so the app feels real and fully functional.

Use React state (no localStorage/browser storage) to manage the selected zoo and navigation state.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2836a0f8-636b-439f-a833-9a0fdfaa0e41).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
